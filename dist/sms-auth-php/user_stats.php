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
    logit("Помилка підключення до бази даних: " . $e->getMessage());
    http_response_code(500); 
    echo json_encode(['message' => 'Помилка підключення до бази даних']);
    exit;
}

/* Обробка ендпоінта /api/users/stats */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $period = $_GET['period'] ?? '30d'; // Період: 7d, 30d, 1y тощо
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
        // Загальна кількість користувачів
        $totalStmt = $pdo->query('SELECT COUNT(*) as total FROM users');
        $totalUsers = $totalStmt->fetch()['total'];

        // Кількість користувачів за статусами
        $statusStmt = $pdo->query('SELECT status, COUNT(*) as count FROM users GROUP BY status');
        $statusCountsRaw = $statusStmt->fetchAll(PDO::FETCH_KEY_PAIR);
        $statusCounts = [
            'active' => (int)($statusCountsRaw['active'] ?? 0),
            'inactive' => (int)($statusCountsRaw['inactive'] ?? 0),
            'banned' => (int)($statusCountsRaw['banned'] ?? 0),
        ];

        // Кількість нових користувачів за період
        $newStmt = $pdo->prepare('SELECT COUNT(*) as new_users FROM users WHERE created_at >= ?');
        $newStmt->execute([$dateFrom]);
        $newUsers = $newStmt->fetch()['new_users'];

        // Загальна кількість замовлень
        $ordersStmt = $pdo->query('SELECT COUNT(*) as total_orders FROM orders');
        $totalOrders = $ordersStmt->fetch()['total_orders'];

        // Середня кількість замовлень на користувача
        $avgOrdersPerUser = $totalUsers > 0 ? $totalOrders / $totalUsers : 0;

        // Приблизний дохід за період
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

        logit("Отримано статистику користувачів для періоду $period: " . json_encode($stats));
        echo json_encode($stats);
    } catch (PDOException $e) {
        logit("Помилка при отриманні статистики користувачів: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['message' => 'Помилка при отриманні статистики користувачів: ' . $e->getMessage()]);
    }
    exit;
}

/* Catch-all для невідомих методів */
http_response_code(404);
logit("Ендпоінт /api/users/stats підтримує лише GET метод, отриманий метод: " . $_SERVER['REQUEST_METHOD']);
echo json_encode([
    'message' => 'Ендпоінт підтримує лише GET метод',
    'uri' => $_SERVER['REQUEST_URI'],
    'method' => $_SERVER['REQUEST_METHOD']
]);
exit;