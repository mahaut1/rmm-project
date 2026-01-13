import bcrypt from "bcryptjs";
import { findUserByEmail, createUserWithPassword } from "../services/user.service.js";
import { generateToken } from "../utils/jwt.js";

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      user_id: user.user_id,
      role: user.role,
    });

    res.json({ token });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function register(req, res) {
  const { email, password, role = "admin" } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await createUserWithPassword({ email, password, role });

    const token = generateToken({
      user_id: user.user_id,
      role: user.role,
    });

    res.status(201).json({ user, token });
  } catch (err) {
    console.error("Error in register:", err);
    res.status(500).json({ message: "Server error" });
  }
}
