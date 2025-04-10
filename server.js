const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_username', // Заміни на свій користувач MySQL
  password: 'your_password', // Заміни на свій пароль MySQL
  database: 'cleaning_service'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Server!');
});

// Створення таблиць (виконується один раз)
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
  );
  CREATE TABLE IF NOT EXISTS discounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    percentage INT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS promo_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount INT NOT NULL
  );
`, (err) => {
  if (err) throw err;
  console.log('Tables created or already exist');
});

// Додавання тестового користувача (виконується один раз)
db.query(`
  INSERT IGNORE INTO users (username, password) VALUES ('admin', 'password123');
`, (err) => {
  if (err) throw err;
  console.log('Test user added or already exists');
});

// Ендпоінт для логіну
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (results.length > 0) {
      res.json({ message: 'Login successful', token: 'dummy-token' }); // Замінити на реальний JWT
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

// Ендпоінт для додавання знижок
app.post('/api/discounts', (req, res) => {
  const { date, percentage } = req.body;
  db.query('INSERT INTO discounts (date, percentage) VALUES (?, ?)', [date, percentage], (err) => {
    if (err) return res.status(500).json({ message: 'Error adding discount' });
    res.json({ message: 'Discount added' });
  });
});

// Ендпоінт для отримання знижок
app.get('/api/discounts', (req, res) => {
  db.query('SELECT * FROM discounts', (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
});

// Ендпоінт для додавання промокодів
app.post('/api/promo-codes', (req, res) => {
  const { code, discount } = req.body;
  db.query('INSERT INTO promo_codes (code, discount) VALUES (?, ?)', [code, discount], (err) => {
    if (err) return res.status(500).json({ message: 'Error adding promo code' });
    res.json({ message: 'Promo code added' });
  });
});

// Ендпоінт для отримання промокодів
app.get('/api/promo-codes', (req, res) => {
  db.query('SELECT * FROM promo_codes', (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});