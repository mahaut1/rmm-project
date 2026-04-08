import "dotenv/config";
import postgres from "postgres";

const sql = postgres({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === "true" ? "require" : undefined
});

export async function query(text, params = []) {
  try {
    const rows = await sql.unsafe(text, params);
    return { rows };
  } catch (err) {
    console.error("DB ERROR:", err);
    throw err;
  }
}

export default sql;