import bcrypt from "bcryptjs";

const password = "admin";

const hash = await bcrypt.hash(password, 10);

console.log("Hash pour le mot de passe :", password);
console.log(hash);
