<?php
function logit(string $m): void {
    $dir = __DIR__ . '/logs';
    if (!is_dir($dir)) mkdir($dir, 0775, true);
    $line = date('[Y-m-d H:i:s] ') . $m . PHP_EOL;
    error_log($line, 3, "$dir/app.log");   
    error_log($line);                      
}

/* CORS */
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header('Vary: Origin');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { 
    http_response_code(200); 
    exit; 
}

/* .env */
foreach (file(__DIR__.'/.env', FILE_IGNORE_NEW_LINES) as $l) {
    if ($l===''||$l[0]==='#'||!str_contains($l,'=')) continue;
    [$k,$v]=explode('=',$l,2); 
    $_ENV[$k]=$v;
}

/* PDO */
try {
    $pdo = new PDO(
        sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
            $_ENV['DB_HOST']??'127.0.0.1', $_ENV['DB_PORT']??'3306', $_ENV['DB_DATABASE']??''),
        $_ENV['DB_USER']??'', 
        $_ENV['DB_PASSWORD']??'',
        [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]
    );
    logit("Підключення до бази даних успішне!");
} catch(PDOException $e) {
    logit("Помилка підключення до бази даних: ".$e->getMessage());
    http_response_code(500); 
    echo '{"message":"Помилка підключення до бази даних"}'; 
    exit;
}

/* SMS helper */
function sms_send(string $phone, string $code): void {
    $apiKey = $_ENV['SMS_API_KEY'] ?? '';
    $from = $_ENV['SMS_FROM'] ?? 'Info';
    if (!$apiKey) throw new RuntimeException('SMS_API_KEY відсутній');
    $payload = http_build_query([
        'access_token' => $apiKey,
        'to' => $phone,
        'from' => $from,
        'message' => "Twój kod weryfikacyjny to: $code",
        'format' => 'json'
    ]);
    $ch = curl_init('https://api.smsapi.pl/sms.do');
    curl_setopt_array($ch, [
        CURLOPT_POST => 1,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_TIMEOUT => 10
    ]);
    $resp = json_decode(curl_exec($ch), true); 
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($resp['error'] ?? false) {
        logit("Помилка відправлення SMS: " . $resp['message']);
        throw new RuntimeException($resp['message']);
    }
    if ($httpCode !== 200) {
        logit("Помилка відправлення SMS: HTTP статус $httpCode");
        throw new RuntimeException("Помилка відправлення SMS: HTTP статус $httpCode");
    }
}

/* вхідні дані */
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

/* ----------- /api/login (admin) ---------------- */
if ($uri === '/api/login' && $method === 'POST') {
    $u = $input['username'] ?? ''; 
    $p = $input['password'] ?? '';
    if (!$u || !$p) {
        logit("Невдалий вхід admin: відсутні username або password");
        http_response_code(400); 
        echo json_encode(['message' => 'Username і password обов’язкові']);
        exit;
    }
    $q = $pdo->prepare('SELECT password FROM admins WHERE username=?'); 
    $q->execute([$u]);
    $row = $q->fetch();
    if ($row && password_verify($p, $row['password'])) {
        logit("Admin $u увійшов");
        echo json_encode(['message' => 'Login successful']);
    } else {
        logit("Невдалий вхід admin: $u");
        http_response_code(401); 
        echo json_encode(['message' => 'Невірний username або password']);
    } 
    exit;
}

/* ----------- /api/send-sms --------------------- */
if ($uri === '/api/send-sms' && $method === 'POST') {
    $phone = $input['phone'] ?? null;
    if (!$phone) {
        http_response_code(400);
        echo json_encode(['message' => 'Номер телефона обов’язковий']);
        exit;
    }
    $code = (string)random_int(100000, 999999);
    logit("Перевірка користувача в базі даних...");
    try {
        $s = $pdo->prepare('SELECT id FROM users WHERE phone=?'); 
        $s->execute([$phone]);
        $exists = $s->rowCount() > 0;
        logit("Користувач $phone ".($exists ? 'знайдений' : 'не знайдений'));
        logit("Збереження коду в базі даних...");
        $pdo->prepare('INSERT INTO sms_codes(phone,code) VALUES(?,?)')->execute([$phone, $code]);
        logit("Код успішно збережено");
        logit("Відправка SMS...");
        sms_send($phone, $code);
        logit("SMS надіслано на $phone, код: $code, userExists: ".($exists ? 'true' : 'false'));
        echo json_encode(['message' => 'SMS надіслано', 'userExists' => $exists]);
    } catch (Throwable $e) {
        logit("Помилка в /api/send-sms: ".$e->getMessage());
        http_response_code(500);
        echo json_encode(['message' => 'Помилка відправлення SMS: ' . $e->getMessage()]);
    } 
    exit;
}

/* ----------- /api/verify-sms ------------------- */
if ($uri === '/api/verify-sms' && $method === 'POST') {
    $phone = $input['phone'] ?? null; 
    $code = $input['code'] ?? null;
    if (!$phone || !$code) {
        http_response_code(400);
        echo json_encode(['message' => 'Номер телефона і код обов’язкові']);
        exit;
    }
    try {
        logit("Перевірка коду в базі даних...");
        $s = $pdo->prepare('SELECT id FROM sms_codes WHERE phone=? AND code=?'); 
        $s->execute([$phone, $code]);
        if (!$s->rowCount()) {
            logit("Невірний код"); 
            http_response_code(400);
            echo json_encode(['message' => 'Невірний код']);
            exit;
        }
        logit("Видалення коду з бази даних...");
        $pdo->prepare('DELETE FROM sms_codes WHERE phone=?')->execute([$phone]);
        logit("Код видалено");
        logit("Перевірка користувача...");
        $u = $pdo->prepare('SELECT id FROM users WHERE phone=?'); 
        $u->execute([$phone]);
        if (!$u->rowCount()) {
            logit("Створення нового користувача...");
            $pdo->prepare('INSERT INTO users(phone) VALUES(?)')->execute([$phone]);
            logit("Новий користувач створений: $phone");
        } else {
            logit("Користувач уже існує: $phone");
        }
        // Оновлення last_login
        $pdo->prepare('UPDATE users SET last_login = NOW() WHERE phone = ?')->execute([$phone]);
        logit("Оновлено last_login для користувача: $phone");
        echo json_encode(['message' => 'Верифікація успішна', 'token' => 'token-'.time()]);
    } catch (Throwable $e) {
        logit("Помилка в /api/verify-sms: ".$e->getMessage());
        http_response_code(500);
        echo json_encode(['message' => 'Помилка верифікації: ' . $e->getMessage()]);
    } 
    exit;
}

/* ----------- /api/discounts -------------------- */
if (preg_match('/^\/api\/discounts(?:\/(\d+))?$/', $uri, $matches)) {
    if ($method === 'GET') {
        $type = $_GET['type'] ?? 'regular';
        logit("Отримуємо знижки для type: $type");
        $stmt = $pdo->prepare('SELECT * FROM discounts WHERE type = ? ORDER BY date');
        $stmt->execute([$type]);
        $discounts = $stmt->fetchAll();
        logit("Знайдено знижок: " . count($discounts));
        echo json_encode($discounts);
        exit;
    }
    if ($method === 'POST') {
        $date = $input['date'] ?? '';
        $perc = (int)($input['percentage'] ?? -1);
        $type = $input['type'] ?? 'regular';
        logit("Отримані дані для знижки: date=$date, percentage=$perc, type=$type");
        if (!$date || $perc < 0 || $perc > 100) {
            logit("Помилка: Невірні дані для знижки");
            http_response_code(400);
            echo json_encode(['message' => 'Невірні дані для знижки: date і percentage (0-100) обов’язкові']);
            exit;
        }
        logit("Додаємо знижку $perc% на $date для type: $type");
        try {
            // Перевірка, чи існує запис
            $checkStmt = $pdo->prepare('SELECT * FROM discounts WHERE date = ? AND type = ?');
            $checkStmt->execute([$date, $type]);
            $existingDiscount = $checkStmt->fetch();
            if ($existingDiscount) {
                logit("Знижка вже існує, оновлюємо: " . json_encode($existingDiscount));
                $stmt = $pdo->prepare('UPDATE discounts SET percentage = ? WHERE date = ? AND type = ?');
                $stmt->execute([$perc, $date, $type]);
                $affectedRows = $stmt->rowCount();
                logit("Оновлено рядків: $affectedRows");
            } else {
                logit("Знижки немає, додаємо нову");
                $stmt = $pdo->prepare('INSERT INTO discounts (date, percentage, type) VALUES (?, ?, ?)');
                $stmt->execute([$date, $perc, $type]);
                $affectedRows = $stmt->rowCount();
                logit("Додано рядків: $affectedRows");
                if ($affectedRows == 0) {
                    logit("Помилка: Знижка не додана!");
                    http_response_code(500);
                    echo json_encode(['message' => 'Помилка: Знижка не додана']);
                    exit;
                }
            }

            // Перевірка наявності знижки
            $checkStmt = $pdo->prepare('SELECT * FROM discounts WHERE date = ? AND type = ?');
            $checkStmt->execute([$date, $type]);
            $result = $checkStmt->fetch();
            if ($result) {
                logit("Перевірка: Знижка знайдена в базі: date=$date, percentage={$result['percentage']}, type={$result['type']}");
            } else {
                logit("Помилка: Знижка НЕ знайдена в базі після додавання!");
                $debugStmt = $pdo->prepare('SELECT * FROM discounts WHERE type = ?');
                $debugStmt->execute([$type]);
                $allDiscounts = $debugStmt->fetchAll();
                logit("Усі знижки для type=$type: " . json_encode($allDiscounts));
                http_response_code(500);
                echo json_encode(['message' => 'Помилка: Знижка не знайдена після додавання']);
                exit;
            }
            echo json_encode(['message' => 'Знижка успішно додана']);
        } catch (PDOException $e) {
            logit("Помилка запису в базу даних: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['message' => 'Помилка запису в базу даних: ' . $e->getMessage()]);
            exit;
        }
        exit;
    }
    if ($method === 'DELETE') {
        $id = $matches[1] ?? null;
        if (!$id) {
            logit("Помилка: ID знижки обов’язковий");
            http_response_code(400);
            echo json_encode(['message' => 'ID знижки обов’язковий']);
            exit;
        }
        logit("Видаляємо знижку з id: $id");
        try {
            $stmt = $pdo->prepare('DELETE FROM discounts WHERE id = ?');
            $stmt->execute([$id]);
            $affectedRows = $stmt->rowCount();
            if ($affectedRows > 0) {
                logit("Знижку з id $id видалено");
                echo json_encode(['message' => 'Знижка успішно видалена']);
            } else {
                logit("Знижку з id $id не знайдено");
                http_response_code(404);
                echo json_encode(['message' => 'Знижка не знайдена']);
            }
        } catch (PDOException $e) {
            logit("Помилка видалення з бази даних: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['message' => 'Помилка видалення з бази даних: ' . $e->getMessage()]);
            exit;
        }
        exit;
    }
}

/* ----------- /api/create-payment --------------- */
/* ----------- /api/create-payment --------------- */
if ($uri === '/api/create-payment' && $method === 'POST') {
    // Налаштування PayU (справжні дані для реального середовища)
    $payuConfig = [
        'merchantPosId' => '4371532', // Справжній POS ID
        'clientId' => '4371532', // Справжній client_id
        'clientSecret' => '6d49178c5f1190f31eb18cfda7c3a726', // Справжній client_secret
        'md5Key' => '02fbc83aff9da2db8dfadd1bb536a043', // Справжній MD5-ключ
        'apiUrl' => 'https://secure.payu.com/api/v2_1/orders', // URL для реального середовища
    ];

    // Отримання даних із запиту
    $orderData = $input;
    $requiredFields = ['order_id', 'total_price', 'description', 'client_email', 'client_phone'];
    foreach ($requiredFields as $field) {
        if (!isset($orderData[$field])) {
            logit("Помилка: Відсутнє обов’язкове поле: $field");
            http_response_code(400);
            echo json_encode(["error" => "Missing required field: $field"]);
            exit;
        }
    }

    // Перевірка унікальності extOrderId (order_id)
    $orderId = $orderData['order_id'];
    $stmt = $pdo->prepare('SELECT id FROM orders WHERE id = ?');
    $stmt->execute([$orderId]);
    if (!$stmt->rowCount()) {
        logit("Помилка: Замовлення з ID $orderId не існує в базі даних");
        http_response_code(404);
        echo json_encode(['error' => 'Замовлення не знайдено']);
        exit;
    }

    // Підготовка даних для PayU
    $payuOrder = [
        'notifyUrl' => 'http://localhost:3001/api/payu-notify', // URL для сповіщень (змінити на публічний домен)
        'customerIp' => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
        'merchantPosId' => $payuConfig['merchantPosId'],
        'description' => $orderData['description'],
        'currencyCode' => 'PLN',
        'totalAmount' => (int)($orderData['total_price'] * 100), // Сума в копійках (грошах)
        'extOrderId' => $orderData['order_id'], // Унікальний ID замовлення в твоїй системі
        'buyer' => [
            'email' => $orderData['client_email'],
            'phone' => $orderData['client_phone'],
            'firstName' => $orderData['client_info']['name'] ?? 'Unknown',
            'lastName' => 'User',
        ],
        'products' => [
            [
                'name' => $orderData['description'],
                'unitPrice' => (int)($orderData['total_price'] * 100),
                'quantity' => 1,
            ],
        ],
        'continueUrl' => 'http://localhost:3000/payment-success', // URL для повернення після оплати (змінити на публічний домен)
        'settings' => [
            'invoiceDisabled' => true, // Вимкнути автоматичне створення інвойсу
        ],
    ];

    // Отримання OAuth-токена
    $tokenUrl = 'https://secure.payu.com/pl/standard/user/oauth/authorize'; // Реальний URL для OAuth
    $tokenData = http_build_query([
        'grant_type' => 'client_credentials',
        'client_id' => $payuConfig['clientId'],
        'client_secret' => $payuConfig['clientSecret'],
    ]);

    $ch = curl_init($tokenUrl);
    curl_setopt_array($ch, [
        CURLOPT_POST => 1,
        CURLOPT_POSTFIELDS => $tokenData,
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
    ]);
    $tokenResponse = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        logit("Помилка отримання OAuth-токена від PayU: HTTP $httpCode, відповідь: $tokenResponse");
        http_response_code(500);
        echo json_encode(['error' => 'Не вдалося отримати OAuth-токен від PayU']);
        exit;
    }

    $tokenData = json_decode($tokenResponse, true);
    $accessToken = $tokenData['access_token'] ?? null;
    if (!$accessToken) {
        logit("Помилка: Не вдалося отримати access_token від PayU: $tokenResponse");
        http_response_code(500);
        echo json_encode(['error' => 'Не вдалося отримати access_token від PayU']);
        exit;
    }

    // Створення замовлення в PayU
    $ch = curl_init($payuConfig['apiUrl']);
    curl_setopt_array($ch, [
        CURLOPT_POST => 1,
        CURLOPT_POSTFIELDS => json_encode($payuOrder),
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_FOLLOWLOCATION => false, // Не слідкувати за редиректами
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $accessToken,
        ],
    ]);
    $payuResponse = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // Перевірка відповіді PayU
    $payuResult = json_decode($payuResponse, true);
    if ($httpCode !== 302 || !isset($payuResult['status']['statusCode']) || $payuResult['status']['statusCode'] !== 'SUCCESS') {
        logit("Помилка створення платежу в PayU: HTTP $httpCode, відповідь: " . json_encode($payuResult));
        http_response_code(500);
        echo json_encode(['error' => 'Не вдалося створити платіж у PayU']);
        exit;
    }

    $redirectUri = $payuResult['redirectUri'] ?? null;
    if (!$redirectUri) {
        logit("Помилка: Не отримано redirectUri від PayU: " . json_encode($payuResult));
        http_response_code(500);
        echo json_encode(['error' => 'Не отримано URL для оплати від PayU']);
        exit;
    }

    logit("Платіж створено, redirectUri: $redirectUri");
    echo json_encode(['redirectUri' => $redirectUri]);
    exit;
}

/* ----------- /api/payu-notify ----------------- */
if ($uri === '/api/payu-notify' && $method === 'POST') {
    $payload = json_decode(file_get_contents('php://input'), true);
    logit("Отримано callback від PayU: " . json_encode($payload));

    $orderId = $payload['order']['extOrderId'] ?? null;
    $status = $payload['order']['status'] ?? null;

    if ($orderId && $status) {
        // Переклад статусу PayU у формат твого проєкту
        $paymentStatus = null;
        switch ($status) {
            case 'COMPLETED':
                $paymentStatus = 'completed';
                break;
            case 'CANCELED':
            case 'REJECTED':
                $paymentStatus = 'cancelled';
                break;
            case 'PENDING':
            case 'WAITING_FOR_CONFIRMATION':
                $paymentStatus = 'pending';
                break;
            default:
                logit("Невідомий статус PayU: $status");
                http_response_code(400);
                echo json_encode(['message' => 'Невідомий статус платежу']);
                exit;
        }

        try {
            $stmt = $pdo->prepare('UPDATE orders SET payment_status = ? WHERE id = ?');
            $stmt->execute([$paymentStatus, $orderId]);
            $affectedRows = $stmt->rowCount();
            if ($affectedRows > 0) {
                logit("Оновлено статус платежу для замовлення $orderId: $paymentStatus");
                http_response_code(200);
                echo json_encode(['message' => 'OK']);
            } else {
                logit("Замовлення з ID $orderId не знайдено");
                http_response_code(404);
                echo json_encode(['message' => 'Замовлення не знайдено']);
            }
        } catch (PDOException $e) {
            logit("Помилка оновлення payment_status: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['message' => 'Помилка оновлення статусу платежу']);
        }
    } else {
        logit("Невірний payload від PayU: " . json_encode($payload));
        http_response_code(400);
        echo json_encode(['message' => 'Невірний payload']);
    }
    exit;
}

/* ----------- /api/promo-codes ------------------ */
if (preg_match('/^\/api\/promo-codes(?:\/(\d+))?$/', $uri, $matches)) {
    if ($method === 'GET') {
        $stmt = $pdo->query('SELECT * FROM promo_codes ORDER BY id DESC');
        $promoCodes = $stmt->fetchAll();
        logit("Отримуємо промокоди, знайдено: " . count($promoCodes));
        echo json_encode($promoCodes);
        exit;
    }
    if ($method === 'POST') {
        $code = $input['code'] ?? '';
        $disc = (int)($input['discount'] ?? -1);
        if (!$code || $disc < 0 || $disc > 100) {
            logit("Помилка: Невірні дані для промокоду");
            http_response_code(400);
            echo json_encode(['message' => 'Невірні дані для промокоду: code і discount (0-100) обов’язкові']);
            exit;
        }
        logit("Додаємо промокод $code зі знижкою $disc%");
        try {
            $stmt = $pdo->prepare('INSERT INTO promo_codes (code, discount) VALUES (?, ?)');
            $stmt->execute([$code, $disc]);
            logit("Створено промокод $code зі знижкою $disc%");
            echo json_encode(['message' => 'Промокод успішно створений']);
        } catch (PDOException $e) {
            logit("Помилка запису промокоду в базу даних: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['message' => 'Помилка запису в базу даних: ' . $e->getMessage()]);
            exit;
        }
        exit;
    }
    if ($method === 'DELETE') {
        $id = $matches[1] ?? null;
        if (!$id) {
            logit("Помилка: ID промокоду обов’язковий");
            http_response_code(400);
            echo json_encode(['message' => 'ID промокоду обов’язковий']);
            exit;
        }
        logit("Видаляємо промокод з id: $id");
        try {
            $stmt = $pdo->prepare('DELETE FROM promo_codes WHERE id = ?');
            $stmt->execute([$id]);
            $affectedRows = $stmt->rowCount();
            if ($affectedRows > 0) {
                logit("Промокод з id $id видалено");
                echo json_encode(['message' => 'Промокод успішно видалений']);
            } else {
                logit("Промокод з id $id не знайдено");
                http_response_code(404);
                echo json_encode(['message' => 'Промокод не знайдений']);
            }
        } catch (PDOException $e) {
            logit("Помилка видалення промокоду з бази даних: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['message' => 'Помилка видалення з бази даних: ' . $e->getMessage()]);
            exit;
        }
        exit;
    }
}

/* ----------- /api/users ------------------------ */
if (preg_match('/^\/api\/users(?:\/(\d+))?$/', $uri, $matches)) {
    if ($method === 'GET' && !isset($matches[1])) {
        // Список усіх користувачів
        $status = $_GET['status'] ?? null;
        $search = $_GET['search'] ?? null;

        $query = 'SELECT * FROM users';
        $conditions = [];
        $params = [];

        if ($status) {
            $conditions[] = 'status = ?';
            $params[] = $status;
        }

        if ($search) {
            $conditions[] = '(name LIKE ? OR phone LIKE ? OR email LIKE ?)';
            $searchTerm = "%$search%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        if (!empty($conditions)) {
            $query .= ' WHERE ' . implode(' AND ', $conditions);
        }

        $query .= ' ORDER BY created_at DESC';

        logit("Отримуємо список користувачів: query=$query");
        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $users = $stmt->fetchAll();
            logit("Знайдено користувачів: " . count($users));
            echo json_encode($users);
        } catch (PDOException $e) {
            logit("Помилка при отриманні користувачів: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['message' => 'Помилка при отриманні користувачів: ' . $e->getMessage()]);
        }
        exit;
    }

    if ($method === 'GET' && isset($matches[1])) {
        // Деталі одного користувача
        $id = $matches[1];
        logit("Отримуємо деталі користувача з id: $id");
        try {
            // Інформація про користувача
            $stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?');
            $stmt->execute([$id]);
            $user = $stmt->fetch();

            if (!$user) {
                logit("Користувача з id $id не знайдено");
                http_response_code(404);
                echo json_encode(['message' => 'Користувача не знайдено']);
                exit;
            }

            // Замовлення користувача
            $stmt = $pdo->prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC');
            $stmt->execute([$id]);
            $orders = $stmt->fetchAll();

            $user['orders'] = $orders;
            logit("Знайдено замовлень для користувача $id: " . count($orders));
            echo json_encode($user);
        } catch (PDOException $e) {
            logit("Помилка при отриманні деталей користувача: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['message' => 'Помилка при отриманні деталей користувача: ' . $e->getMessage()]);
        }
        exit;
    }

    if ($method === 'PUT' && isset($matches[1])) {
        // Оновлення користувача
        $id = $matches[1];
        $name = $input['name'] ?? null;
        $email = $input['email'] ?? null;
        $status = $input['status'] ?? null;

        if (!$name && !$email && !$status) {
            logit("Помилка: Потрібно вказати хоча б одне поле для оновлення");
            http_response_code(400);
            echo json_encode(['message' => 'Потрібно вказати хоча б одне поле для оновлення']);
            exit;
        }

        $updates = [];
        $params = [];

        if ($name) {
            $updates[] = 'name = ?';
            $params[] = $name;
        }

        if ($email) {
            $updates[] = 'email = ?';
            $params[] = $email;
        }

        if ($status && in_array($status, ['active', 'inactive', 'banned'])) {
            $updates[] = 'status = ?';
            $params[] = $status;
        }

        if (empty($updates)) {
            logit("Помилка: Невірні дані для оновлення");
            http_response_code(400);
            echo json_encode(['message' => 'Невірні дані для оновлення']);
            exit;
        }

        $params[] = $id;
        $query = 'UPDATE users SET ' . implode(', ', $updates) . ' WHERE id = ?';

        logit("Оновлюємо користувача з id: $id, query=$query");
        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $affectedRows = $stmt->rowCount();
            if ($affectedRows > 0) {
                logit("Користувача з id $id оновлено");
                echo json_encode(['message' => 'Користувач успішно оновлений']);
            } else {
                logit("Користувача з id $id не знайдено");
                http_response_code(404);
                echo json_encode(['message' => 'Користувача не знайдено']);
            }
        } catch (PDOException $e) {
            logit("Помилка при оновленні користувача: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['message' => 'Помилка при оновленні користувача: ' . $e->getMessage()]);
        }
        exit;
    }

    if ($method === 'DELETE' && isset($matches[1])) {
        // Видалення користувача
        $id = $matches[1];
        logit("Видаляємо користувача з id: $id");
        try {
            $stmt = $pdo->prepare('DELETE FROM users WHERE id = ?');
            $stmt->execute([$id]);
            $affectedRows = $stmt->rowCount();
            if ($affectedRows > 0) {
                logit("Користувача з id $id видалено");
                echo json_encode(['message' => 'Користувач успішно видалений']);
            } else {
                logit("Користувача з id $id не знайдено");
                http_response_code(404);
                echo json_encode(['message' => 'Користувача не знайдено']);
            }
        } catch (PDOException $e) {
            logit("Помилка при видаленні користувача: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['message' => 'Помилка при видаленні користувача: ' . $e->getMessage()]);
        }
        exit;
    }
}

/* ----------- /api/users/stats ------------------ */
if ($uri === '/api/users/stats' && $method === 'GET') {
    $period = $_GET['period'] ?? '30d'; // 7d, 30d, 1y

    try {
        $stats = [];

        // Загальна кількість користувачів
        $stmt = $pdo->query('SELECT COUNT(*) as total FROM users');
        $stats['total_users'] = (int)$stmt->fetchColumn();

        // Кількість користувачів за статусом
        $stmt = $pdo->query('SELECT status, COUNT(*) as count FROM users GROUP BY status');
        $statusCounts = $stmt->fetchAll();
        $stats['status_counts'] = [];
        foreach ($statusCounts as $row) {
            $stats['status_counts'][$row['status']] = (int)$row['count'];
        }

        // Нові користувачі за період
        $dateCondition = '';
        switch ($period) {
            case '7d':
                $dateCondition = 'WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
                break;
            case '1y':
                $dateCondition = 'WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)';
                break;
            case '30d':
            default:
                $dateCondition = 'WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
                break;
        }
        $stmt = $pdo->query("SELECT COUNT(*) as new_users FROM users $dateCondition");
        $stats['new_users'] = (int)$stmt->fetchColumn();

        // Середня кількість замовлень на користувача
        $stmt = $pdo->query('SELECT COUNT(*) as total_orders FROM orders');
        $totalOrders = (int)$stmt->fetchColumn();
        $stats['avg_orders_per_user'] = $stats['total_users'] > 0 ? round($totalOrders / $stats['total_users'], 2) : 0;

        logit("Отримано статистику користувачів: " . json_encode($stats));
        echo json_encode($stats);
    } catch (PDOException $e) {
        logit("Помилка при отриманні статистики: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['message' => 'Помилка при отриманні статистики: ' . $e->getMessage()]);
    }
    exit;
}

/* ----------- /api/orders ----------------------- */
/* ----------- /api/orders ----------------------- */
if (preg_match('/^\/api\/orders(?:\/(\d+))?$/', $uri, $matches)) {
    if ($method === 'GET' && !isset($matches[1])) {
        // Список усіх замовлень
        $userId = $_GET['user_id'] ?? null;
        $serviceType = $_GET['service_type'] ?? null;
        $status = $_GET['status'] ?? null;
        $dateFrom = $_GET['date_from'] ?? null;
        $dateTo = $_GET['date_to'] ?? null;

        $query = 'SELECT * FROM orders';
        $conditions = [];
        $params = [];

        if ($userId) {
            $conditions[] = 'user_id = ?';
            $params[] = $userId;
        }

        if ($serviceType) {
            $conditions[] = 'service_type = ?';
            $params[] = $serviceType;
        }

        if ($status) {
            $conditions[] = 'status = ?';
            $params[] = $status;
        }

        if ($dateFrom) {
            $conditions[] = 'order_date >= ?';
            $params[] = $dateFrom;
        }

        if ($dateTo) {
            $conditions[] = 'order_date <= ?';
            $params[] = $dateTo;
        }

        if (!empty($conditions)) {
            $query .= ' WHERE ' . implode(' AND ', $conditions);
        }

        $query .= ' ORDER BY order_date DESC';

        logit("Отримуємо список замовлень: query=$query");
        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $orders = $stmt->fetchAll();
            logit("Знайдено замовлень: " . count($orders));
            echo json_encode($orders);
        } catch (PDOException $e) {
            logit("Помилка при отриманні замовлень: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['message' => 'Помилка при отриманні замовлень: ' . $e->getMessage()]);
        }
        exit;
    }

    if ($method === 'POST' && !isset($matches[1])) {
        // Створення нового замовлення
        $orderData = $input;
        logit("Вхідні дані для створення замовлення: " . json_encode($orderData));

        // Перевірка наявності всіх необхідних даних
        $requiredFields = ["order_type", "total_price", "city", "address", "client_info", "payment_status"];
        foreach ($requiredFields as $field) {
            if (!isset($orderData[$field])) {
                logit("Помилка: Відсутнє обов’язкове поле: $field");
                http_response_code(400);
                echo json_encode(["error" => "Missing required field: $field"]);
                exit;
            }
        }

        // Витягуємо дані про клієнта
        if (!isset($orderData['client_info'])) {
            logit("Помилка: client_info відсутнє у вхідних даних");
            http_response_code(400);
            echo json_encode(["error" => "Missing required field: client_info"]);
            exit;
        }
        $clientInfo = $orderData['client_info'];
        logit("Дані client_info: " . json_encode($clientInfo));
        $clientName = $clientInfo['name'] ?? null;
        $clientPhone = $clientInfo['phone'] ?? null;
        $clientEmail = $clientInfo['email'] ?? null;
        $clientAdditionalInfo = $clientInfo['additional_info'] ?? null;
        $clientType = $clientInfo['client_type'] ?? null;
        logit("Витягнуті значення: clientName=$clientName, clientPhone=$clientPhone, clientEmail=$clientEmail, clientType=$clientType");

        // Перевірка, чи є клієнт із таким телефоном або email
        $userId = null;
        if ($clientPhone || $clientEmail) {
            logit("Перевірка користувача: phone=$clientPhone, email=$clientEmail");
            $query = 'SELECT id FROM users WHERE phone = ? OR email = ?';
            $stmt = $pdo->prepare($query);
            $stmt->execute([$clientPhone, $clientEmail]);
            $user = $stmt->fetch();

            if ($user) {
                // Користувач уже існує
                $userId = $user['id'];
                logit("Користувач із phone=$clientPhone або email=$clientEmail уже існує, user_id=$userId");
            } else {
                // Створюємо нового користувача
                logit("Створюємо нового користувача...");
                $query = 'INSERT INTO users (name, phone, email, created_at) VALUES (?, ?, ?, NOW())';
                $stmt = $pdo->prepare($query);
                $stmt->execute([$clientName, $clientPhone, $clientEmail]);
                $userId = $pdo->lastInsertId();
                logit("Створено нового користувача: user_id=$userId, phone=$clientPhone, email=$clientEmail");
            }
        } else {
            logit("Телефон або email відсутні у client_info, користувач не створюється");
        }

        // Логуємо всі поля, які мають бути в замовленні
        $orderType = $orderData["order_type"];
        logit("Тип замовлення: $orderType");
        logit("Поля замовлення: rooms=" . ($orderData["rooms"] ?? 'null') . 
              ", bathrooms=" . ($orderData["bathrooms"] ?? 'null') . 
              ", kitchen=" . ($orderData["kitchen"] ?? 'null') . 
              ", kitchen_annex=" . ($orderData["kitchen_annex"] ?? 'null') . 
              ", vacuum_needed=" . ($orderData["vacuum_needed"] ?? 'null') . 
              ", selected_services=" . (isset($orderData["selected_services"]) ? json_encode($orderData["selected_services"]) : 'null') . 
              ", cleaning_frequency=" . ($orderData["cleaning_frequency"] ?? 'null') . 
              ", selected_date=" . ($orderData["selected_date"] ?? 'null') . 
              ", selected_time=" . ($orderData["selected_time"] ?? 'null'));

        // Підготовка SQL-запиту залежно від типу замовлення
        $columns = ["order_type", "total_price", "city", "address", "client_info", "payment_status"];
        $values = [$orderType, $orderData["total_price"], $orderData["city"], json_encode($orderData["address"]), json_encode($orderData["client_info"]), $orderData["payment_status"]];
        $placeholders = array_fill(0, count($values), "?");

        // Додаємо user_id до замовлення
        $columns[] = "user_id";
        $values[] = $userId;
        $placeholders[] = "?";

        switch ($orderType) {
            case "window_cleaning":
                // Перевірка наявності всіх необхідних полів
                $requiredWindowFields = ["windows", "balconies", "selected_date", "selected_time"];
                foreach ($requiredWindowFields as $field) {
                    if (!isset($orderData[$field])) {
                        logit("Помилка: Відсутнє обов’язкове поле для window_cleaning: $field");
                        http_response_code(400);
                        echo json_encode(["error" => "Missing required field for window_cleaning: $field"]);
                        exit;
                    }
                }
                $columns[] = "windows";
                $columns[] = "balconies";
                $columns[] = "client_type";
                $columns[] = "selected_date";
                $columns[] = "selected_time";
                $values[] = $orderData["windows"];
                $values[] = $orderData["balconies"];
                $values[] = $clientType;
                $values[] = $orderData["selected_date"];
                $values[] = $orderData["selected_time"];
                $placeholders[] = "?";
                $placeholders[] = "?";
                $placeholders[] = "?";
                $placeholders[] = "?";
                $placeholders[] = "?";
                break;
            case "renovation":
                // Перевірка наявності всіх необхідних полів
                $requiredRenovationFields = ["area", "windows", "selected_date", "selected_time"];
                foreach ($requiredRenovationFields as $field) {
                    if (!isset($orderData[$field])) {
                        logit("Помилка: Відсутнє обов’язкове поле для renovation: $field");
                        http_response_code(400);
                        echo json_encode(["error" => "Missing required field for renovation: $field"]);
                        exit;
                    }
                }
                $columns[] = "area";
                $columns[] = "windows";
                $columns[] = "client_type";
                $columns[] = "selected_date";
                $columns[] = "selected_time";
                $values[] = $orderData["area"];
                $values[] = $orderData["windows"];
                $values[] = $clientType;
                $values[] = $orderData["selected_date"];
                $values[] = $orderData["selected_time"];
                $placeholders[] = "?";
                $placeholders[] = "?";
                $placeholders[] = "?";
                $placeholders[] = "?";
                $placeholders[] = "?";
                break;
            case "office":
                // Перевірка наявності всіх необхідних полів
                $requiredOfficeFields = ["office_area", "workspaces", "cleaning_frequency", "selected_date", "selected_time"];
                foreach ($requiredOfficeFields as $field) {
                    if (!isset($orderData[$field])) {
                        logit("Помилка: Відсутнє обов’язкове поле для office: $field");
                        http_response_code(400);
                        echo json_encode(["error" => "Missing required field for office: $field"]);
                        exit;
                    }
                }
                $columns[] = "office_area";
                $columns[] = "workspaces";
                $columns[] = "cleaning_frequency";
                $columns[] = "selected_date";
                $columns[] = "selected_time";
                $values[] = $orderData["office_area"];
                $values[] = $orderData["workspaces"];
                $values[] = $orderData["cleaning_frequency"];
                $values[] = $orderData["selected_date"];
                $values[] = $orderData["selected_time"];
                $placeholders[] = "?";
                $placeholders[] = "?";
                $placeholders[] = "?";
                $placeholders[] = "?";
                $placeholders[] = "?";
                break;
            case "private_house":
            case "apartment":
                // Перевірка наявності всіх необхідних полів
                $requiredApartmentFields = ["rooms", "bathrooms", "kitchen", "kitchen_annex", "vacuum_needed", "selected_services", "cleaning_frequency", "selected_date", "selected_time"];
                foreach ($requiredApartmentFields as $field) {
                    if (!isset($orderData[$field])) {
                        logit("Помилка: Відсутнє обов’язкове поле для apartment/private_house: $field");
                        http_response_code(400);
                        echo json_encode(["error" => "Missing required field for apartment/private_house: $field"]);
                        exit;
                    }
                }

                $columns[] = "client_type";
                $columns[] = "rooms";
                $columns[] = "bathrooms";
                $columns[] = "kitchen";
                $columns[] = "kitchen_annex";
                $columns[] = "vacuum_needed";
                $columns[] = "selected_services";
                $columns[] = "cleaning_frequency";
                $columns[] = "selected_date";
                $columns[] = "selected_time";
                $values[] = $clientType;
                $values[] = $orderData["rooms"];
                $values[] = $orderData["bathrooms"];
                $values[] = $orderData["kitchen"] ? 1 : 0;
                $values[] = $orderData["kitchen_annex"] ? 1 : 0;
                $values[] = $orderData["vacuum_needed"] ? 1 : 0;
                $values[] = json_encode($orderData["selected_services"]);
                $values[] = $orderData["cleaning_frequency"];
                $values[] = $orderData["selected_date"];
                $values[] = $orderData["selected_time"];
                $placeholders[] = "?";
                $placeholders[] = "?";
                $placeholders[] = "?";
                $placeholders[] = "?";
                $placeholders[] = "?";
                $placeholders[] = "?";
                $placeholders[] = "?";
                $placeholders[] = "?";
                $placeholders[] = "?";
                $placeholders[] = "?";
                break;
            default:
                logit("Помилка: Непідтримуваний тип замовлення: $orderType");
                http_response_code(400);
                echo json_encode(["error" => "Unsupported order type"]);
                exit;
        }

        // Формуємо SQL-запит
        $columnsStr = implode(", ", $columns);
        $placeholdersStr = implode(", ", $placeholders);
        $sql = "INSERT INTO orders ($columnsStr) VALUES ($placeholdersStr)";
        logit("SQL-запит для створення замовлення: $sql");

        try {
            $stmt = $pdo->prepare($sql);
            $stmt->execute($values);
            $orderId = $pdo->lastInsertId();
            logit("Замовлення створено з ID: $orderId");
            echo json_encode(["orderId" => $orderId]);
        } catch (PDOException $e) {
            logit("Помилка створення замовлення: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(["error" => "Failed to create order: " . $e->getMessage()]);
            exit;
        }
        exit;
    }

    if ($method === 'PUT' && isset($matches[1])) {
        // Оновлення замовлення
        $id = $matches[1];
        $status = $input['status'] ?? null;

        if (!$status || !in_array($status, ['pending', 'completed', 'cancelled'])) {
            logit("Помилка: Невірний статус замовлення");
            http_response_code(400);
            echo json_encode(['message' => 'Невірний статус замовлення: має бути pending, completed або cancelled']);
            exit;
        }

        logit("Оновлюємо замовлення з id: $id");
        try {
            $stmt = $pdo->prepare('UPDATE orders SET status = ? WHERE id = ?');
            $stmt->execute([$status, $id]);
            $affectedRows = $stmt->rowCount();
            if ($affectedRows > 0) {
                logit("Замовлення з id $id оновлено");
                echo json_encode(['message' => 'Замовлення успішно оновлено']);
            } else {
                logit("Замовлення з id $id не знайдено");
                http_response_code(404);
                echo json_encode(['message' => 'Замовлення не знайдено']);
            }
        } catch (PDOException $e) {
            logit("Помилка при оновленні замовлення: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['message' => 'Помилка при оновленні замовлення: ' . $e->getMessage()]);
        }
        exit;
    }
}
http_response_code(404);
logit("Ендпоінт не знайдено: $uri, метод: $method");
echo json_encode([
    'message' => 'Ендпоінт не знайдено',
    'uri' => $uri,
    'method' => $method
]);
exit;
?>