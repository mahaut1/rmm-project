import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import db from "../src/config/db.js";

const schemaPath = path.join(process.cwd(), "src", "schema.sqlite.sql");
const schema = fs.readFileSync(schemaPath, "utf8");

db.exec(schema);
console.log("✅ SQLite schema applied");