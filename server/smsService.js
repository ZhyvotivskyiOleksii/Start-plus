import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

export const sendSms = async (phone, code) => {
  const apiKey = process.env.SMS_API_KEY;
  if (!apiKey) {
    console.error("Помилка: SMS_API_KEY відсутній у .env");
    throw new Error("SMS_API_KEY відсутній");
  }

  const message = `Twój kod weryfikacyjny to: ${code}`;
  console.log(`Відправка SMS на ${phone} з кодом ${code}`);

  try {
    const response = await axios.post("https://api.smsapi.pl/sms.do", null, {
      params: {
        access_token: apiKey,
        to: phone,
        from: "Info",
        message: message,
        format: "json",
      },
    });
    console.log("SMSAPI відповідь:", response.data);
    if (response.data.error) {
      throw new Error(`SMSAPI error: ${response.data.message}`);
    }
  } catch (error) {
    console.error("Помилка відправки SMS через SMSAPI:", error.message);
    throw error;
  }
};