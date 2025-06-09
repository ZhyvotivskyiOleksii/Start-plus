<?php
date_default_timezone_set('Europe/Warsaw'); 

function logit(string $m): void {
    $dir = __DIR__ . '/logs';
    if (!is_dir($dir)) mkdir($dir, 0775, true);
    $line = date('[Y-m-d H:i:s] ') . $m . PHP_EOL;
    error_log($line, 3, "$dir/app.log");   
    error_log($line);                      
}

function normalizePhoneNumber(string $phone): string {
    $phone = preg_replace('/^\+\d{1,3}/', '', $phone);
    $phone = preg_replace('/[^0-9]/', '', $phone);
    return $phone;
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
    echo json_encode(['message' => 'Помилка підключення до бази даних']); 
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

$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Обрізаємо базовий префікс (/sms-auth-php), якщо він є
$base = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/'); // "/sms-auth-php" або ""
$path = '/' . ltrim(substr($uri, strlen($base)), '/'); // завжди "/api/send-sms"

/* ----------- /api/login (admin) ---------------- */
if ($path === '/api/login' && $method === 'POST') {
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
if ($path === '/api/send-sms' && $method === 'POST') {
    $phone = $input['phone'] ?? null;
    if (!$phone) {
        http_response_code(400);
        echo json_encode(['message' => 'Номер телефона обов’язковий']);
        exit;
    }
    $code = (string)random_int(100000, 999999);
    $normalizedPhone = normalizePhoneNumber($phone);
    logit("Перевірка користувача в базі даних...");
    try {
        $s = $pdo->prepare('SELECT id FROM users WHERE REPLACE(phone, "+", "") LIKE ?'); 
        $s->execute(["%$normalizedPhone%"]);
        $exists = $s->rowCount() > 0;
        logit("Користувач $phone ".($exists ? 'знайдений' : 'не знайдений'));
        logit("Збереження коду в базі даних...");
        $stmt = $pdo->prepare('INSERT INTO sms_codes (phone, code, created_at) VALUES (?, ?, ?)');
        $stmt->execute([$phone, $code, date('Y-m-d H:i:s')]);
        $affectedRows = $stmt->rowCount();
        logit("Код успішно збережено, додано рядків: $affectedRows");
        $checkStmt = $pdo->prepare('SELECT * FROM sms_codes WHERE phone = ? AND code = ?');
        $checkStmt->execute([$phone, $code]);
        $smsRecord = $checkStmt->fetch();
        if ($smsRecord) {
            logit("Перевірка: Код знайдено в базі: " . json_encode($smsRecord));
        } else {
            logit("Помилка: Код НЕ знайдено в базі після додавання!");
        }
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
if ($path === '/api/verify-sms' && $method === 'POST') {
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
        $normalizedPhone = normalizePhoneNumber($phone);
        $u = $pdo->prepare('SELECT id FROM users WHERE REPLACE(phone, "+", "") LIKE ?'); 
        $u->execute(["%$normalizedPhone%"]);
        if (!$u->rowCount()) {
            logit("Створення нового користувача...");
            $stmt = $pdo->prepare('INSERT INTO users (phone, created_at) VALUES (?, ?)');
            $stmt->execute([$phone, date('Y-m-d H:i:s')]);
            logit("Новий користувач створений: $phone");
        } else {
            logit("Користувач уже існує: $phone");
        }
        $pdo->prepare('UPDATE users SET last_login = ? WHERE phone = ?')->execute([date('Y-m-d H:i:s'), $phone]);
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
if (preg_match('/^\/api\/discounts(?:\/(\d+))?$/', $path, $matches)) {
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

/* ----------- /api/create-payu-payment --------------- */
if ($path === '/api/create-payu-payment' && $method === 'POST') {
    $payuConfig = [
        'merchantPosId' => '4371532',
        'clientId' => '4371532',
        'clientSecret' => '6d49178c5f1190f31eb18cfda7c3a726',
        'md5Key' => '02fbc83aff9da2db8dfadd1bb536a043',
        'apiUrl' => 'https://secure.payu.com/api/v2_1/orders',
    ];

    $orderData = $input;
    $requiredFields = ['order_id', 'total_price', 'client_email', 'client_phone'];
    foreach ($requiredFields as $field) {
        if (!isset($orderData[$field])) {
            logit("Помилка: Відсутнє обов’язкове поле: $field");
            http_response_code(400);
            echo json_encode(["error" => "Missing required field: $field"]);
            exit;
        }
    }

    $orderId = $orderData['order_id'];
    $stmt = $pdo->prepare('SELECT id FROM orders WHERE id = ? AND payment_status = "pending"');
    $stmt->execute([$orderId]);
    if (!$stmt->rowCount()) {
        logit("Помилка: Замовлення з ID $orderId не існує або вже оброблено");
        http_response_code(404);
        echo json_encode(['error' => 'Замовлення не знайдено або вже оброблено']);
        exit;
    }

    $payuOrder = [
        'notifyUrl' => $_ENV['PAYU_NOTIFY_URL'] ?? 'http://localhost:3001/api/payu-notify',
        'customerIp' => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
        'merchantPosId' => $payuConfig['merchantPosId'],
        'description' => $orderData['description'] ?? "Zamówienie #$orderId",
        'currencyCode' => 'PLN',
        'totalAmount' => (int)($orderData['total_price'] * 100), // Переводимо в копійки
        'extOrderId' => (string)$orderId,
        'buyer' => [
            'email' => $orderData['client_email'],
            'phone' => $orderData['client_phone'],
            'firstName' => $orderData['client_info']['name'] ? explode(' ', $orderData['client_info']['name'])[0] : 'Jan',
            'lastName' => $orderData['client_info']['name'] ? (explode(' ', $orderData['client_info']['name'])[1] ?? 'Kowalski') : 'Kowalski',
        ],
        'products' => [
            [
                'name' => $orderData['description'] ?? "Sprzątanie #$orderId",
                'unitPrice' => (int)($orderData['total_price'] * 100),
                'quantity' => 1,
            ],
        ],
        'continueUrl' => $_ENV['PAYU_CONTINUE_URL'] ?? 'http://localhost:3000/payment-success',
        'settings' => [
            'invoiceDisabled' => true,
        ],
    ];

    $tokenUrl = 'https://secure.payu.com/pl/standard/user/oauth/authorize';
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

    $ch = curl_init($payuConfig['apiUrl']);
    curl_setopt_array($ch, [
        CURLOPT_POST => 1,
        CURLOPT_POSTFIELDS => json_encode($payuOrder),
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $accessToken,
        ],
    ]);
    $payuResponse = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

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
if ($path === '/api/payu-notify' && $method === 'POST') {
    $payload = json_decode(file_get_contents('php://input'), true);
    logit("Отримано callback від PayU: " . json_encode($payload));

    $orderId = $payload['order']['extOrderId'] ?? null;
    $status = $payload['order']['status'] ?? null;

    if ($orderId && $status) {
        $paymentStatus = null;
        $orderStatus = null;
        switch ($status) {
            case 'COMPLETED':
                $paymentStatus = 'completed';
                $orderStatus = 'completed';
                break;
            case 'CANCELED':
            case 'REJECTED':
                $paymentStatus = 'cancelled';
                $orderStatus = 'cancelled';
                break;
            case 'PENDING':
            case 'WAITING_FOR_CONFIRMATION':
                $paymentStatus = 'pending';
                $orderStatus = 'pending';
                break;
            default:
                logit("Невідомий статус PayU: $status");
                http_response_code(400);
                echo json_encode(['message' => 'Невідомий статус платежу']);
                exit;
        }

        try {
            $stmt = $pdo->prepare('UPDATE orders SET payment_status = ?, status = ? WHERE id = ?');
            $stmt->execute([$paymentStatus, $orderStatus, $orderId]);
            $affectedRows = $stmt->rowCount();
            if ($affectedRows > 0) {
                logit("Оновлено статус платежу та замовлення для ID $orderId: payment_status=$paymentStatus, status=$orderStatus");
                http_response_code(200);
                echo json_encode(['message' => 'OK']);
            } else {
                logit("Замовлення з ID $orderId не знайдено");
                http_response_code(404);
                echo json_encode(['message' => 'Замовлення не знайдено']);
            }
        } catch (PDOException $e) {
            logit("Помилка оновлення статусу: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['message' => 'Помилка оновлення статусу']);
        }
    } else {
        logit("Невірний payload від PayU: " . json_encode($payload));
        http_response_code(400);
        echo json_encode(['message' => 'Невірний payload']);
    }
    exit;
}

/* ----------- /api/promo-codes ------------------ */
if (preg_match('/^\/api\/promo-codes(?:\/(\d+))?$/', $path, $matches)) {
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
if (preg_match('/^\/api\/users(?:\/(\d+))?$/', $path, $matches)) {
    if ($method === 'GET' && !isset($matches[1])) {
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

            foreach ($users as &$user) {
                $orderStmt = $pdo->prepare('SELECT COUNT(*) as order_count FROM orders WHERE user_id = ?');
                $orderStmt->execute([$user['id']]);
                $user['order_count'] = (int)$orderStmt->fetch()['order_count'];

                $spentStmt = $pdo->prepare('SELECT SUM(total_price) as total_spent FROM orders WHERE user_id = ?');
                $spentStmt->execute([$user['id']]);
                $user['total_spent'] = (float)($spentStmt->fetch()['total_spent'] ?? 0);
            }

            echo json_encode($users);
        } catch (PDOException $e) {
            logit("Помилка при отриманні користувачів: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['message' => 'Помилка при отриманні користувачів: ' . $e->getMessage()]);
        }
        exit;
    }

    if ($method === 'GET' && isset($matches[1])) {
        $id = $matches[1];
        logit("Отримуємо деталі користувача з id: $id");
        try {
            $stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?');
            $stmt->execute([$id]);
            $user = $stmt->fetch();

            if (!$user) {
                logit("Користувача з id $id не знайдено");
                http_response_code(404);
                echo json_encode(['message' => 'Користувача не знайдено']);
                exit;
            }

            $stmt = $pdo->prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC');
            $stmt->execute([$id]);
            $orders = $stmt->fetchAll();

            foreach ($orders as &$order) {
                $orderDetails = [];

                if ($order['client_info']) {
                    $clientInfo = json_decode($order['client_info'], true);
                    if (is_array($clientInfo)) {
                        $order['client_info'] = $clientInfo;
                        if (!isset($clientInfo['additional_info']) && $order['details']) {
                            $order['client_info']['additional_info'] = $order['details'];
                        }
                    } else {
                        $order['client_info'] = ['name' => 'N/A', 'phone' => 'N/A', 'additional_info' => 'N/A'];
                    }
                } else {
                    $order['client_info'] = ['name' => 'N/A', 'phone' => 'N/A', 'additional_info' => 'N/A'];
                }

                if ($order['address']) {
                    $address = json_decode($order['address'], true);
                    if (is_array($address)) {
                        $order['address'] = [
                            'street' => $address['street'] ?? 'N/A',
                            'house_number' => $address['house_number'] ?? 'N/A',
                            'apartment_number' => $address['apartment_number'] ?? '',
                        ];
                    } else {
                        $order['address'] = ['street' => 'N/A', 'house_number' => 'N/A', 'apartment_number' => ''];
                    }
                } else {
                    $order['address'] = ['street' => 'N/A', 'house_number' => 'N/A', 'apartment_number' => ''];
                }

                $order['city'] = $order['city'] ?? 'N/A';

                switch ($order['order_type']) {
                    case 'window_cleaning':
                        $orderDetails['windows'] = $order['windows'] ?? 'N/A';
                        $orderDetails['balconies'] = $order['balconies'] ?? 'N/A';
                        break;
                    case 'renovation':
                        $orderDetails['area'] = $order['area'] ?? 'N/A';
                        $orderDetails['windows'] = $order['windows'] ?? 'N/A';
                        break;
                    case 'office':
                        $orderDetails['office_area'] = $order['office_area'] ?? 'N/A';
                        $orderDetails['workspaces'] = $order['workspaces'] ?? 'N/A';
                        $orderDetails['cleaning_frequency'] = $order['cleaning_frequency'] ?? 'N/A';
                        break;
                    case 'private_house':
                    case 'apartment':
                    case 'standard':
                    case 'general':
                        $orderDetails['rooms'] = $order['rooms'] ?? 'N/A';
                        $orderDetails['bathrooms'] = $order['bathrooms'] ?? 'N/A';
                        $orderDetails['kitchen'] = $order['kitchen'] ? 'Tak' : 'Nie';
                        $orderDetails['kitchen_annex'] = $order['kitchen_annex'] ? 'Tak' : 'Nie';
                        $orderDetails['vacuum_needed'] = $order['vacuum_needed'] ? 'Tak' : 'Nie';
                        $orderDetails['cleaning_frequency'] = $order['cleaning_frequency'] ?? 'N/A';
                        if ($order['selected_services']) {
                            $services = json_decode($order['selected_services'], true);
                            if (is_array($services)) {
                                $orderDetails['selected_services'] = array_map(function ($service) {
                                    return [
                                        'name' => $service['name'] ?? 'N/A',
                                        'price' => $service['price'] ?? 'N/A',
                                        'quantity' => $service['quantity'] ?? 'N/A'
                                    ];
                                }, $services);
                            } else {
                                $orderDetails['selected_services'] = 'Brak';
                            }
                        } else {
                            $orderDetails['selected_services'] = 'Brak';
                        }
                        break;
                    default:
                        $orderDetails['info'] = 'Невідомий тип замовлення';
                }

                $order['order_details'] = $orderDetails;
            }

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
if ($path === '/api/users/stats' && $method === 'GET') {
    $period = $_GET['period'] ?? '30d';
    $dateFrom = null;
    switch ($period) {
        case '7d':
            $dateFrom = date('Y-m-d H:i:s', strtotime('-7 days'));
            break;
        case '1y':
            $dateFrom = date('Y-m-d H:i:s', strtotime('-1 year'));
            break;
        case '30d':
        default:
            $dateFrom = date('Y-m-d H:i:s', strtotime('-30 days'));
            break;
    }

    try {
        $totalStmt = $pdo->query('SELECT COUNT(*) as total FROM users');
        $totalUsers = $totalStmt->fetch()['total'];

        $statusStmt = $pdo->query('SELECT status, COUNT(*) as count FROM users GROUP BY status');
        $statusCountsRaw = $statusStmt->fetchAll(PDO::FETCH_KEY_PAIR);
        $statusCounts = [
            'active' => (int)($statusCountsRaw['active'] ?? 0),
            'inactive' => (int)($statusCountsRaw['inactive'] ?? 0),
            'banned' => (int)($statusCountsRaw['banned'] ?? 0),
        ];

        $newStmt = $pdo->prepare('SELECT COUNT(*) as new_users FROM users WHERE created_at >= ?');
        $newStmt->execute([$dateFrom]);
        $newUsers = $newStmt->fetch()['new_users'];

        $ordersStmt = $pdo->query('SELECT COUNT(*) as total_orders FROM orders');
        $totalOrders = $ordersStmt->fetch()['total_orders'];

        $avgOrdersPerUser = $totalUsers > 0 ? $totalOrders / $totalUsers : 0;

        $revenueStmt = $pdo->prepare('SELECT SUM(total_price) as revenue FROM orders WHERE created_at >= ?');
        $revenueStmt->execute([$dateFrom]);
        $revenue = $revenueStmt->fetch()['revenue'] ?? 0;

        $stats = [
            'total_users' => (int)$totalUsers,
            'status_counts' => $statusCounts,
            'new_users' => (int)$newUsers,
            'avg_orders_per_user' => round($avgOrdersPerUser, 2),
            'total_orders' => (int)$totalOrders,
            'revenue' => (float)$revenue,
        ];

        logit("Отримано статистику користувачів: " . json_encode($stats));
        echo json_encode($stats);
    } catch (PDOException $e) {
        logit("Помилка при отриманні статистики користувачів: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['message' => 'Помилка при отриманні статистики користувачів']);
    }
    exit;
}

/* ----------- /api/orders ----------------------- */
if (preg_match('/^\/api\/orders(?:\/(\d+))?$/', $path, $matches)) {
    if ($method === 'GET' && !isset($matches[1])) {
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
            $conditions[] = 'order_type = ?';
            $mappedServiceType = $serviceType;
            $serviceTypeMapping = [
                'office-cleaning' => 'office',
                'private-house' => 'private_house',
                'window-cleaning' => 'window_cleaning',
                'post-renovation' => 'renovation',
                'regular' => 'apartment',
                'standard' => 'standard',
                'general' => 'general',
            ];
            if (isset($serviceTypeMapping[$serviceType])) {
                $mappedServiceType = $serviceTypeMapping[$serviceType];
            }
            $params[] = $mappedServiceType;
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

        $query .= ' ORDER BY created_at DESC';

        logit("Отримуємо список замовлень: query=$query");
        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $orders = $stmt->fetchAll();
            logit("Знайдено замовлень: " . count($orders));

            foreach ($orders as &$order) {
                $orderDetails = [];

                if ($order['client_info']) {
                    $clientInfo = json_decode($order['client_info'], true);
                    if (is_array($clientInfo)) {
                        $order['client_info'] = $clientInfo;
                        if (!isset($clientInfo['additional_info']) && $order['details']) {
                            $order['client_info']['additional_info'] = $order['details'];
                        }
                    } else {
                        $order['client_info'] = ['name' => 'N/A', 'phone' => 'N/A', 'additional_info' => 'N/A'];
                    }
                } else {
                    $order['client_info'] = ['name' => 'N/A', 'phone' => 'N/A', 'additional_info' => 'N/A'];
                }

                if ($order['address']) {
                    $address = json_decode($order['address'], true);
                    if (is_array($address)) {
                        $order['address'] = [
                            'street' => $address['street'] ?? 'N/A',
                            'house_number' => $address['house_number'] ?? 'N/A',
                            'apartment_number' => $address['apartment_number'] ?? '',
                        ];
                    } else {
                        $order['address'] = ['street' => 'N/A', 'house_number' => 'N/A', 'apartment_number' => ''];
                    }
                } else {
                    $order['address'] = ['street' => 'N/A', 'house_number' => 'N/A', 'apartment_number' => ''];
                }

                $order['city'] = $order['city'] ?? 'N/A';

                switch ($order['order_type']) {
                    case 'window_cleaning':
                        $orderDetails['windows'] = $order['windows'] ?? 'N/A';
                        $orderDetails['balconies'] = $order['balconies'] ?? 'N/A';
                        break;
                    case 'renovation':
                        $orderDetails['area'] = $order['area'] ?? 'N/A';
                        $orderDetails['windows'] = $order['windows'] ?? 'N/A';
                        break;
                    case 'office':
                        $orderDetails['office_area'] = $order['office_area'] ?? 'N/A';
                        $orderDetails['workspaces'] = $order['workspaces'] ?? 'N/A';
                        $orderDetails['cleaning_frequency'] = $order['cleaning_frequency'] ?? 'N/A';
                        break;
                    case 'private_house':
                    case 'apartment':
                    case 'standard':
                    case 'general':
                        $orderDetails['rooms'] = $order['rooms'] ?? 'N/A';
                        $orderDetails['bathrooms'] = $order['bathrooms'] ?? 'N/A';
                        $orderDetails['kitchen'] = $order['kitchen'] ? 'Tak' : 'Nie';
                        $orderDetails['kitchen_annex'] = $order['kitchen_annex'] ? 'Tak' : 'Nie';
                        $orderDetails['vacuum_needed'] = $order['vacuum_needed'] ? 'Tak' : 'Nie';
                        $orderDetails['cleaning_frequency'] = $order['cleaning_frequency'] ?? 'N/A';
                        if ($order['selected_services']) {
                            $services = json_decode($order['selected_services'], true);
                            if (is_array($services)) {
                                $orderDetails['selected_services'] = array_map(function ($service) {
                                    return [
                                        'name' => $service['name'] ?? 'N/A',
                                        'price' => $service['price'] ?? 'N/A',
                                        'quantity' => $service['quantity'] ?? 'N/A'
                                    ];
                                }, $services);
                            } else {
                                $orderDetails['selected_services'] = 'Brak';
                            }
                        } else {
                            $orderDetails['selected_services'] = 'Brak';
                        }
                        break;
                    default:
                        $orderDetails['info'] = 'Невідомий тип замовлення';
                }

                $order['service_type'] = $order['order_type'];
                $order['order_details'] = $orderDetails;
            }

            echo json_encode($orders);
        } catch (PDOException $e) {
            logit("Помилка при отриманні замовлень: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['message' => 'Помилка при отриманні замовлень: ' . $e->getMessage()]);
        }
        exit;
    }

    /* ----------- /api/orders/stats ------------------ */
    if ($path === '/api/orders/stats' && $method === 'GET') {
        $period = $_GET['period'] ?? '7d';
        $days = 7;
        if ($period === '30d') $days = 30;
        elseif ($period === '90d') $days = 90;

        try {
            $totalStmt = $pdo->query('SELECT COUNT(*) as total FROM orders');
            $totalOrders = $totalStmt->fetch()['total'];

            $typeStmt = $pdo->query('SELECT order_type, COUNT(*) as count FROM orders GROUP BY order_type');
            $typeCounts = $typeStmt->fetchAll(PDO::FETCH_KEY_PAIR);

            $newStmt = $pdo->prepare('SELECT COUNT(*) as new_orders FROM orders WHERE created_at >= ?');
            $newStmt->execute([date('Y-m-d H:i:s', strtotime("-$days days"))]);
            $newOrders = $newStmt->fetch()['new_orders'];

            $totalPriceStmt = $pdo->query('SELECT AVG(total_price) as avg_price FROM orders');
            $avgPrice = $totalPriceStmt->fetch()['avg_price'];

            $stats = [
                'total_orders' => (int)$totalOrders,
                'type_counts' => $typeCounts,
                'new_orders' => (int)$newOrders,
                'avg_price' => round($avgPrice, 2),
            ];

            logit("Отримано статистику замовлень: " . json_encode($stats));
            echo json_encode($stats);
        } catch (PDOException $e) {
            logit("Помилка при отриманні статистики замовлень: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['message' => 'Помилка при отриманні статистики замовлень']);
        }
        exit;
    }

    if ($method === 'POST' && !isset($matches[1])) {
        $orderData = $input;
        logit("Вхідні дані для створення замовлення: " . json_encode($orderData));

        $requiredFields = ["order_type", "total_price", "city", "address", "client_info", "payment_status"];
        foreach ($requiredFields as $field) {
            if (!isset($orderData[$field])) {
                logit("Помилка: Відсутнє обов’язкове поле: $field");
                http_response_code(400);
                echo json_encode(["error" => "Missing required field: $field"]);
                exit;
            }
        }

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
        $companyName = $clientInfo['company_name'] ?? null;
        $nip = $clientInfo['nip'] ?? null;
        $vatInfo = $clientInfo['vat_info'] ?? null;
        logit("Витягнуті значення: clientName=$clientName, clientPhone=$clientPhone, clientEmail=$clientEmail, clientType=$clientType, companyName=$companyName, nip=$nip, vatInfo=" . json_encode($vatInfo));

        $updatedClientInfo = [
            'name' => $clientName,
            'phone' => $clientPhone,
            'email' => $clientEmail,
            'additional_info' => $clientAdditionalInfo,
            'vat_info' => $vatInfo
        ];

        $userId = null;
        if ($clientPhone || $clientEmail) {
            $normalizedPhone = normalizePhoneNumber($clientPhone);
            logit("Перевірка користувача: normalized_phone=$normalizedPhone, email=$clientEmail");
            $query = 'SELECT id FROM users WHERE REPLACE(phone, "+", "") LIKE ? OR email = ?';
            $stmt = $pdo->prepare($query);
            $stmt->execute(["%$normalizedPhone%", $clientEmail]);
            $user = $stmt->fetch();

            if ($user) {
                $userId = $user['id'];
                logit("Користувач із normalized_phone=$normalizedPhone або email=$clientEmail уже існує, user_id=$userId");
                if ($clientName) {
                    $stmt = $pdo->prepare('UPDATE users SET name = ? WHERE id = ?');
                    $stmt->execute([$clientName, $userId]);
                    logit("Оновлено ім'я користувача з id $userId: name=$clientName");
                }
            } else {
                logit("Створюємо нового користувача...");
                $query = 'INSERT INTO users (name, phone, email, created_at) VALUES (?, ?, ?, ?)';
                $stmt = $pdo->prepare($query);
                $stmt->execute([$clientName, $clientPhone, $clientEmail, date('Y-m-d H:i:s')]);
                $userId = $pdo->lastInsertId();
                logit("Створено нового користувача: user_id=$userId, phone=$clientPhone, email=$clientEmail");
            }
        } else {
            logit("Телефон або email відсутні у client_info, користувач не створюється");
        }

        if ($orderData["order_type"] === "quick_order") {
            $orderType = $orderData["cleaning_category"] ?? "standard";
        } else {
            $orderType = $orderData["order_type"];
        }
        logit("Тип замовлення: $orderType");
        logit("Поля замовлення: rooms=" . ($orderData["rooms"] ?? 'null') . 
              ", bathrooms=" . ($orderData["bathrooms"] ?? 'null') . 
              ", kitchen=" . ($orderData["kitchen"] ?? 'null') . 
              ", kitchen_annex=" . ($orderData["kitchen_annex"] ?? 'null') . 
              ", vacuum_needed=" . ($orderData["vacuum_needed"] ?? 'null') . 
              ", selected_services=" . (isset($orderData["selected_services"]) ? json_encode($orderData["selected_services"]) : 'null') . 
              ", cleaning_frequency=" . ($orderData["cleaning_frequency"] ?? 'null') . 
              ", selected_date=" . ($orderData["selected_date"] ?? 'null') . 
              ", selected_time=" . ($orderData["selected_time"] ?? 'null') . 
              ", order_date=" . (isset($orderData["selected_date"]) && isset($orderData["selected_time"]) ? ($orderData["selected_date"] . " " . $orderData["selected_time"] . ":00") : 'null') . 
              ", details=" . ($orderData["details"] ?? 'null'));

        $columns = ["order_type", "total_price", "city", "address", "client_info", "payment_status", "status", "created_at"];
        $values = [$orderType, $orderData["total_price"], $orderData["city"], json_encode($orderData["address"]), json_encode($updatedClientInfo), $orderData["payment_status"], "pending", date('Y-m-d H:i:s')];
        $placeholders = array_fill(0, count($values), "?");

        $columns[] = "user_id";
        $values[] = $userId;
        $placeholders[] = "?";

        $columns[] = "client_type";
        $values[] = $clientType;
        $placeholders[] = "?";

        if ($clientType === "Firma") {
            $columns[] = "company_name";
            $values[] = $companyName;
            $placeholders[] = "?";

            $columns[] = "nip";
            $values[] = $nip;
            $placeholders[] = "?";
        }

        if (isset($orderData["selected_date"]) && isset($orderData["selected_time"])) {
            $orderDate = $orderData["selected_date"] . " " . $orderData["selected_time"] . ":00";
            $columns[] = "order_date";
            $values[] = $orderDate;
            $placeholders[] = "?";
        }

        if (isset($orderData["details"])) {
            $columns[] = "details";
            $values[] = $orderData["details"];
            $placeholders[] = "?";
        }

        if (in_array($orderType, ["standard", "general"])) {
            $requiredFields = ["rooms", "bathrooms", "selected_date", "selected_time"];
            foreach ($requiredFields as $field) {
                if (!isset($orderData[$field])) {
                    logit("Помилка: Відсутнє обов’язкове поле для $orderType: $field");
                    http_response_code(400);
                    echo json_encode(["error" => "Missing required field for $orderType: $field"]);
                    exit;
                }
            }
            $columns[] = "rooms";
            $columns[] = "bathrooms";
            $columns[] = "selected_date";
            $columns[] = "selected_time";
            $values[] = $orderData["rooms"];
            $values[] = $orderData["bathrooms"];
            $values[] = $orderData["selected_date"];
            $values[] = $orderData["selected_time"];
            $placeholders[] = "?";
            $placeholders[] = "?";
            $placeholders[] = "?";
            $placeholders[] = "?";
        } else {
            switch ($orderType) {
                case "window_cleaning":
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
                    $columns[] = "selected_date";
                    $columns[] = "selected_time";
                    $values[] = $orderData["windows"];
                    $values[] = $orderData["balconies"];
                    $values[] = $orderData["selected_date"];
                    $values[] = $orderData["selected_time"];
                    $placeholders[] = "?";
                    $placeholders[] = "?";
                    $placeholders[] = "?";
                    $placeholders[] = "?";
                    break;
                case "renovation":
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
                    $columns[] = "selected_date";
                    $columns[] = "selected_time";
                    $values[] = $orderData["area"];
                    $values[] = $orderData["windows"];
                    $values[] = $orderData["selected_date"];
                    $values[] = $orderData["selected_time"];
                    $placeholders[] = "?";
                    $placeholders[] = "?";
                    $placeholders[] = "?";
                    $placeholders[] = "?";
                    break;
                case "office":
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
                    $requiredApartmentFields = ["rooms", "bathrooms", "kitchen", "kitchen_annex", "vacuum_needed", "selected_services", "cleaning_frequency", "selected_date", "selected_time"];
                    foreach ($requiredApartmentFields as $field) {
                        if (!isset($orderData[$field])) {
                            logit("Помилка: Відсутнє обов’язкове поле для apartment/private_house: $field");
                            http_response_code(400);
                            echo json_encode(["error" => "Missing required field for apartment/private_house: $field"]);
                            exit;
                        }
                    }
                    $columns[] = "rooms";
                    $columns[] = "bathrooms";
                    $columns[] = "kitchen";
                    $columns[] = "kitchen_annex";
                    $columns[] = "vacuum_needed";
                    $columns[] = "selected_services";
                    $columns[] = "cleaning_frequency";
                    $columns[] = "selected_date";
                    $columns[] = "selected_time";
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
                    break;
                default:
                    logit("Помилка: Непідтримуваний тип замовлення: $orderType");
                    http_response_code(400);
                    echo json_encode(["error" => "Unsupported order type"]);
                    exit;
            }
        }

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
        }
        exit;
    }

    if ($method === 'PUT' && isset($matches[1])) {
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

/* ----------- /api/save-consent ----------------- */
if ($path === '/api/save-consent' && $method === 'POST') {
    try {
        $consent = $input['consent'] ?? null;
        $userId = $input['userId'] ?? null;

        if (!$consent) {
            logit("Помилка: Відсутні дані згоди в /api/save-consent");
            http_response_code(400);
            echo json_encode(['message' => 'Дані згоди обов’язкові']);
            exit;
        }

        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
        $ipHash = hash('sha256', $ip);
        $userAgentHash = hash('sha256', $userAgent);
        $consentId = sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );

        $stmt = $pdo->prepare('
            INSERT INTO cookie_consents (consent_id, ip_hash, user_agent_hash, user_id, necessary, preferences, statistics, marketing)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ');
        $stmt->execute([
            $consentId,
            $ipHash,
            $userAgentHash,
            $userId,
            1, // necessary завжди true
            $consent['preferences'] ? 1 : 0,
            $consent['statistics'] ? 1 : 0,
            $consent['marketing'] ? 1 : 0,
        ]);

        logit("Згоду збережено для IP (хеш): $ipHash, user_id: " . ($userId ?? 'немає'));
        echo json_encode(['message' => 'Згода успішно збережена', 'consent_id' => $consentId]);
    } catch (Throwable $e) {
        logit("Помилка в /api/save-consent: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['message' => 'Помилка збереження згоди: ' . $e->getMessage()]);
    }
    exit;
}

/* Catch-all для невідомих ендпоінтів */
http_response_code(404);
logit("Ендпоінт не знайдено: $uri, метод: $method");
echo json_encode([
    'message' => 'Ендпоінт не знайдено',
    'uri' => $uri,
    'method' => $method
]);
exit;