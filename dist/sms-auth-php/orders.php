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

        // Підготовка SQL-запиту залежно від типу замовлення
        $orderType = $orderData["order_type"];
        $columns = ["order_type", "total_price", "city", "address", "client_info", "payment_status"];
        $values = [$orderType, $orderData["total_price"], $orderData["city"], json_encode($orderData["address"]), json_encode($orderData["client_info"]), $orderData["payment_status"]];
        $placeholders = array_fill(0, count($values), "?");

        switch ($orderType) {
            case "window_cleaning":
                $columns[] = "windows";
                $columns[] = "balconies";
                $columns[] = "client_type";
                $columns[] = "selected_date";
                $columns[] = "selected_time";
                $values[] = $orderData["windows"];
                $values[] = $orderData["balconies"];
                $values[] = $orderData["clientInfo"]["clientType"];
                $values[] = $orderData["selectedDate"];
                $values[] = $orderData["selectedTime"];
                $placeholders[] = "?";
                $placeholders[] = "?";
                $placeholders[] = "?";
                $placeholders[] = "?";
                $placeholders[] = "?";
                break;
            case "renovation":
                $columns[] = "area";
                $columns[] = "windows";
                $columns[] = "client_type";
                $columns[] = "selected_date";
                $columns[] = "selected_time";
                $values[] = $orderData["area"];
                $values[] = $orderData["windows"];
                $values[] = $orderData["clientInfo"]["clientType"];
                $values[] = $orderData["selectedDate"];
                $values[] = $orderData["selectedTime"];
                $placeholders[] = "?";
                $placeholders[] = "?";
                $placeholders[] = "?";
                $placeholders[] = "?";
                $placeholders[] = "?";
                break;
            case "office":
                $columns[] = "office_area";
                $columns[] = "workspaces";
                $columns[] = "cleaning_frequency";
                $columns[] = "selected_date";
                $columns[] = "selected_time";
                $values[] = $orderData["officeArea"];
                $values[] = $orderData["workspaces"];
                $values[] = $orderData["cleaningFrequency"];
                $values[] = $orderData["selectedDate"];
                $values[] = $orderData["selectedTime"];
                $placeholders[] = "?";
                $placeholders[] = "?";
                $placeholders[] = "?";
                $placeholders[] = "?";
                $placeholders[] = "?";
                break;
            case "private_house":
            case "apartment":
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
                $values[] = $orderData["clientType"];
                $values[] = $orderData["rooms"];
                $values[] = $orderData["bathrooms"];
                $values[] = $orderData["kitchen"] ? 1 : 0;
                $values[] = $orderData["kitchenAnnex"] ? 1 : 0;
                $values[] = $orderData["vacuumNeeded"] ? 1 : 0;
                $values[] = json_encode($orderData["selectedServices"]);
                $values[] = $orderData["cleaningFrequency"];
                $values[] = $orderData["selectedDate"];
                $values[] = $orderData["selectedTime"];
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

        if (isset($orderData["selectedDate"])) {
            $columns[] = "selected_date";
            $values[] = $orderData["selectedDate"];
            $placeholders[] = "?";
        }

        if (isset($orderData["selectedTime"])) {
            $columns[] = "selected_time";
            $values[] = $orderData["selectedTime"];
            $placeholders[] = "?";
        }

        // Формуємо SQL-запит
        $columnsStr = implode(", ", $columns);
        $placeholdersStr = implode(", ", $placeholders);
        $sql = "INSERT INTO orders ($columnsStr) VALUES ($placeholdersStr)";

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