import "dotenv/config";
import bcrypt from "bcryptjs";
import { query } from "../src/config/db.js";

const email = process.env.ADMIN_EMAIL ;
const password = process.env.ADMIN_PASSWORD ;
const role = "admin";

const hash = await bcrypt.hash(password, 10);

await query(
  `INSERT INTO users (email, password_hash, role)
   VALUES ($1, $2, $3)
   ON CONFLICT (email)
   DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role`,
  [email, hash, role]
);

console.log("✅ Admin seeded/updated:", email);
process.exit(0);
