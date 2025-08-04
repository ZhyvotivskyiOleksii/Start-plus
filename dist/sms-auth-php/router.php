<?php
// router.php
// если файл/папка существует — отдать его
$url = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (file_exists(__DIR__ . $url)) {
  return false;
}
// иначе прокинуть в index.php
require __DIR__ . '/index.php';
