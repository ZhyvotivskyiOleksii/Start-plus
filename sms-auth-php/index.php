<?php
function logit(string $m): void {
    $dir = __DIR__ . '/logs';
    if (!is_dir($dir)) mkdir($dir, 0775, true);
    $line = date('[Y-m-d H:i:s] ') . $m . PHP_EOL;
    error_log($line, 3, "$dir/app.log");   // файл
    error_log($line);                      // консоль
}

/* CORS */
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header('Vary: Origin');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

/* .env */
foreach (file(__DIR__.'/.env', FILE_IGNORE_NEW_LINES) as $l) {
    if ($l===''||$l[0]==='#'||!str_contains($l,'=')) continue;
    [$k,$v]=explode('=',$l,2); $_ENV[$k]=$v;
}

/* PDO */
try{
    $pdo=new PDO(
        sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
            $_ENV['DB_HOST']??'127.0.0.1',$_ENV['DB_PORT']??'3306',$_ENV['DB_DATABASE']??''),
        $_ENV['DB_USER']??'',$_ENV['DB_PASSWORD']??'',
        [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]
    );
    logit("Підключення до бази даних успішне!");
}catch(PDOException $e){
    logit("Помилка підключення до бази даних: ".$e->getMessage());
    http_response_code(500); echo'{"message":"DB error"}'; exit;
}

/* SMS helper */
function sms_send(string $phone,string $code):void{
    $apiKey=$_ENV['SMS_API_KEY']??'';
    if(!$apiKey) throw new RuntimeException('SMS_API_KEY відсутній');
    $payload=http_build_query([
        'access_token'=>$apiKey,'to'=>$phone,'from'=>'Info',
        'message'=>"Twój kod weryfikacyjny to: $code",'format'=>'json'
    ]);
    $ch=curl_init('https://api.smsapi.pl/sms.do');
    curl_setopt_array($ch,[CURLOPT_POST=>1,CURLOPT_POSTFIELDS=>$payload,
        CURLOPT_RETURNTRANSFER=>1,CURLOPT_TIMEOUT=>10]);
    $resp=json_decode(curl_exec($ch),true); curl_close($ch);
    if($resp['error']??false) throw new RuntimeException($resp['message']);
}

/* вхідні дані */
$input=json_decode(file_get_contents('php://input'),true) ?: $_POST;
$uri=parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH);
$method=$_SERVER['REQUEST_METHOD'];

/* ----------- /api/login (admin) ---------------- */
if ($uri==='/api/login' && $method==='POST') {
    $u=$input['username']??''; $p=$input['password']??'';
    $q=$pdo->prepare('SELECT password FROM admins WHERE username=?'); $q->execute([$u]);
    $row=$q->fetch();
    if($row && password_verify($p,$row['password'])){
        logit("Admin $u увійшов");
        echo'{"message":"Login successful"}';
    }else{
        logit("Невдалий вхід admin: '.$u.'");
        http_response_code(401); echo'{"message":"Invalid credentials"}';
    } exit;
}

/* ----------- /api/send-sms --------------------- */
if($uri==='/api/send-sms' && $method==='POST'){
    $phone=$input['phone']??null;
    if(!$phone){http_response_code(400);echo'{"message":"Номер телефона обязателен"}';exit;}
    $code=(string)random_int(100000,999999);
    logit("Перевірка користувача в базі даних...");
    try{
        $s=$pdo->prepare('SELECT id FROM users WHERE phone=?'); $s->execute([$phone]);
        $exists=$s->rowCount()>0;
        logit("Користувач $phone ".($exists?'знайдений':'не знайдений'));
        logit("Збереження коду в базі даних...");
        $pdo->prepare('INSERT INTO sms_codes(phone,code) VALUES(?,?)')->execute([$phone,$code]);
        logit("Код успішно збережено");
        logit("Відправка SMS...");
        sms_send($phone,$code);
        logit("SMS надіслано на $phone, код: $code, userExists: ".($exists?'true':'false'));
        echo json_encode(['message'=>'SMS надіслано','userExists'=>$exists]);
    }catch(Throwable $e){
        logit("Помилка в /api/send-sms: ".$e->getMessage());
        http_response_code(500);echo'{"message":"Помилка відправлення SMS"}';
    } exit;
}

/* ----------- /api/verify-sms ------------------- */
if($uri==='/api/verify-sms' && $method==='POST'){
    $phone=$input['phone']??null; $code=$input['code']??null;
    if(!$phone||!$code){http_response_code(400);echo'{"message":"Номер телефона і код обов’язкові"}';exit;}
    try{
        logit("Перевірка коду в базі даних...");
        $s=$pdo->prepare('SELECT id FROM sms_codes WHERE phone=? AND code=?'); $s->execute([$phone,$code]);
        if(!$s->rowCount()){logit("Невірний код"); http_response_code(400);echo'{"message":"Невірний код"}';exit;}
        logit("Видалення коду з бази даних...");
        $pdo->prepare('DELETE FROM sms_codes WHERE phone=?')->execute([$phone]);
        logit("Код видалено");
        logit("Перевірка користувача...");
        $u=$pdo->prepare('SELECT id FROM users WHERE phone=?'); $u->execute([$phone]);
        if(!$u->rowCount()){
            logit("Створення нового користувача...");
            $pdo->prepare('INSERT INTO users(phone) VALUES(?)')->execute([$phone]);
            logit("Новий користувач створений: $phone");
        }else logit("Користувач уже існує: $phone");
        echo json_encode(['message'=>'Верифікація успішна','token'=>'token-'.time()]);
    }catch(Throwable $e){
        logit("Помилка в /api/verify-sms: ".$e->getMessage());
        http_response_code(500);echo'{"message":"Помилка верифікації"}';
    } exit;
}

/* ----------- /api/discounts -------------------- */
if ($uri==='/api/discounts') {
    if ($method==='GET') { echo json_encode($pdo->query('SELECT * FROM discounts ORDER BY date')->fetchAll()); exit; }
    if ($method==='POST') {
        $date=$input['date']??''; $perc=(int)($input['percentage']??-1);
        if(!$date||$perc<0||$perc>100){http_response_code(400);exit;}
        $pdo->prepare('INSERT INTO discounts(date,percentage) VALUES(?,?) ON DUPLICATE KEY UPDATE percentage=?')
            ->execute([$date,$perc,$perc]);
        logit("Знижку $perc% встановлено на $date");
        echo'{"message":"ok"}'; exit;
    }
}

/* ----------- /api/promo-codes ------------------ */
if ($uri==='/api/promo-codes') {
    if ($method==='GET') { echo json_encode($pdo->query('SELECT * FROM promo_codes ORDER BY id DESC')->fetchAll()); exit; }
    if ($method==='POST') {
        $code=$input['code']??''; $disc=(int)($input['discount']??-1);
        if(!$code||$disc<0||$disc>100){http_response_code(400);exit;}
        $pdo->prepare('INSERT INTO promo_codes(code,discount) VALUES(?,?)')->execute([$code,$disc]);
        logit("Створено промокод $code зі знижкою $disc%");
        echo'{"message":"ok"}'; exit;
    }
}

http_response_code(404);
echo'{"message":"not found"}';
