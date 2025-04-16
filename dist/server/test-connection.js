import pool from "./db.js";

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Успішне підключення до бази даних!");
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error("Помилка підключення до бази даних:", error);
    process.exit(1);
  }
})();
