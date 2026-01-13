import "dotenv/config";
import postgres from "postgres";

const host = process.env.DB_HOST;
const port = Number(process.env.DB_PORT || 5432);
const database = process.env.DB_NAME;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

if (!host || !database || !user || !password) {
  throw new Error("Missing DB_* env vars. Check backend/.env");
}

// Local docker => pas de SSL
const sql = postgres({
  host,
  port,
  database,
  user,
  password,
  ssl: false,
});

export async function query(text, params = []) {
  const rows = await sql.unsafe(text, params);
  return { rows };
}

export default sql;
