import mysql from "mysql2/promise";
import { config } from "dotenv";

config({ path: "../.env" });

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
    console.log("Підключення до бази даних успішне!");
    await connection.end();
  } catch (error) {
    console.error("Помилка підключення до бази даних:", error);
  }
})();