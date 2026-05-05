const mysql1 = require("mysql/promise");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function createPool() {
    return mysql1.createPool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 5
    });
}

async function query(pool, sql, params = []) {
    const [rows] = await pool.execute(sql, params);
    return rows;
}
const mysql = require("mysql2/promise");

(async () => {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "testdb"
  });

  const [rows] = await conn.execute("SELECT 1");
  console.log(rows);

  await conn.end();
})();


module.exports = { createPool, query };
