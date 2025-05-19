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