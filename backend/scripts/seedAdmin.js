import "dotenv/config";
import bcrypt from "bcryptjs";
import { query } from "../src/config/db.js";

const email = process.env.ADMIN_EMAIL || "admin@test.com";
const password = process.env.ADMIN_PASSWORD || "Admin123!";
const role = process.env.ADMIN_ROLE || "admin";

async function main() {
  const hash = await bcrypt.hash(password, 10);

  await query(
    `INSERT INTO users (email, password_hash, role)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE SET
       password_hash = EXCLUDED.password_hash,
       role = EXCLUDED.role`,
    [email, hash, role]
  );

  console.log(`✅ Admin upserted: ${email}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ seed admin error:", err);
  process.exit(1);
});