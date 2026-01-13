import "dotenv/config";
import app from "./app.js";
import { query } from "./config/db.js";

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await query("SELECT 1");
    console.log("✅ DB connected");
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  }
}

start();
