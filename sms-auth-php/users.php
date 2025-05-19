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

/* вхідні дані */
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

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

/* Catch-all для невідомих ендпоінтів */
http_response_code(404);
logit("Ендпоінт не знайдено: $uri, метод: $method");
echo json_encode([
    'message' => 'Ендпоінт не знайдено',
    'uri' => $uri,
    'method' => $method
]);
exit;
?>