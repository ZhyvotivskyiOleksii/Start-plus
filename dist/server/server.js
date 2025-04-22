import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pool from "./db.js";
import { sendSms } from "./smsService.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/send-sms", async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    console.log("Помилка: Номер телефона відсутній");
    return res.status(400).json({ message: "Номер телефона обязателен" });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    console.log("Перевірка користувача в базі даних...");
    let userExists = false;
    try {
      const [rows] = await pool.execute("SELECT * FROM users WHERE phone = ?", [phone]);
      userExists = rows.length > 0;
      console.log(`Користувач ${phone} ${userExists ? "знайдений" : "не знайдений"}`);
    } catch (dbError) {
      console.error("Помилка запиту до бази даних (SELECT users):", dbError);
      throw dbError;
    }

    console.log("Збереження коду в базі даних...");
    try {
      await pool.execute("INSERT INTO sms_codes (phone, code) VALUES (?, ?)", [phone, code]);
      console.log("Код успішно збережено");
    } catch (dbError) {
      console.error("Помилка запиту до бази даних (INSERT sms_codes):", dbError);
      throw dbError;
    }

    console.log("Відправка SMS...");
    try {
      await sendSms(phone, code);
      console.log(`SMS надіслано на ${phone}, код: ${code}, userExists: ${userExists}`);
    } catch (smsError) {
      console.error("Помилка відправки SMS:", smsError);
      throw smsError;
    }

    res.json({ message: "SMS надіслано", userExists });
  } catch (error) {
    console.error("Помилка в /api/send-sms:", error);
    res.status(500).json({ message: "Помилка відправлення SMS" });
  }
});

app.post("/api/verify-sms", async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    console.log("Помилка: Номер телефона або код відсутні");
    return res.status(400).json({ message: "Номер телефона і код обов’язкові" });
  }

  try {
    console.log("Перевірка коду в базі даних...");
    const [rows] = await pool.execute("SELECT * FROM sms_codes WHERE phone = ? AND code = ?", [phone, code]);
    if (rows.length === 0) {
      console.log("Невірний код");
      return res.status(400).json({ message: "Невірний код" });
    }

    console.log("Видалення коду з бази даних...");
    await pool.execute("DELETE FROM sms_codes WHERE phone = ?", [phone]);
    console.log("Код видалено");

    console.log("Перевірка користувача...");
    const [userRows] = await pool.execute("SELECT * FROM users WHERE phone = ?", [phone]);
    if (userRows.length === 0) {
      console.log("Створення нового користувача...");
      await pool.execute("INSERT INTO users (phone) VALUES (?)", [phone]);
      console.log(`Новий користувач створений: ${phone}`);
    } else {
      console.log(`Користувач уже існує: ${phone}`);
    }

    const token = `token-${Date.now()}`;
    res.json({ message: "Верифікація успішна", token });
  } catch (error) {
    console.error("Помилка в /api/verify-sms:", error);
    res.status(500).json({ message: "Помилка верифікації" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});