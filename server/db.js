import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Підключення до бази даних успішне!");
    connection.release();
  } catch (error) {
    console.error("Помилка підключення до бази даних:", error);
  }
})();

export default pool;