const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const { getUsers, saveUsers } = require("./Helper");

dotenv.config();

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const users = getUsers();

  const exist = users.find(u => u.email === email);
  if (exist) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now(),
    username,
    email,
    password: hashedPassword,
    role: role || "user"
  };

  users.push(newUser);
  saveUsers(users);

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    }
  });
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    message: "Login success",
    token
  });
});

module.exports = router;
