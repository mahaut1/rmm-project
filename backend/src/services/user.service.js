import { query } from "../config/db.js";
import bcrypt from "bcryptjs";

export async function findUserByEmail(email) {
  const res = await query(
    `SELECT
       user_id,
       email,
       password_hash,
       role,
       created_at
     FROM users
     WHERE email = $1`,
    [email]
  );
  return res.rows[0];
}

export async function createUserWithPassword({ email, password, role = "admin" }) {
  const passwordHash = await bcrypt.hash(password, 10);

  const res = await query(
    `INSERT INTO users (email, password_hash, role)
     VALUES ($1, $2, $3)
     RETURNING user_id, email, role, created_at`,
    [email, passwordHash, role]
  );

  return res.rows[0];
}
