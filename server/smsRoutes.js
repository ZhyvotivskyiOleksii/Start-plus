// smsRoutes.js
import express from "express";
import { sendSms } from "./smsService.js";

const router = express.Router();

router.post("/send-sms", async (req, res) => {
  const { phone } = req.body;
  
  if (!phone) {
    return res.status(400).json({ message: "Невірно вказаний номер телефону." });
  }
  
  // Генеруємо унікальний код (наприклад, 6-значний код)
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  try {
    const smsResponse = await sendSms(phone, code);
    
    // Збережіть код у вашій базі даних або в сесії для перевірки пізніше.
    // Для тестування: повертаємо код клієнту (на продакшені – цього не робіть).
    return res.json({ message: "SMS надіслано успішно!", code });
  } catch (error) {
    return res.status(500).json({ message: "Неможливо відправити SMS.", error: error.message });
  }
});

export default router;
