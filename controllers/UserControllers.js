const fs = require("fs");
const path = require("path");
const { userValidate } = require("../validations/userValidate");
const bcrypt = require("bcrypt");

// const sendMail = require("../utils/sendMails")
let users = [];

const userFilePath = path.join(__dirname, "..", "db", "users.json");

if (fs.existsSync(userFilePath)) {
  users = JSON.parse(fs.readFileSync(userFilePath, "utf8"));
} else {
  fs.writeFileSync(userFilePath, "[]");
}

// Get all users
function findAll(req, res) {
  res.json({ message: "User list", data: users });
}

// Get one user
function findOne(req, res, next) {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    return next(error);
  }

  res.json({ message: "User found", data: user });
}

// Create user
async function createUser(req, res, next) {
  try {
    const { error, value } = userValidate.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map((err) => err.message);
      error.message = messages;
      return next(error);
    }

    const { email, password, username } = value; 

    const existUser = users.find((user) => user.email === email);

    if (existUser) {
      const err = new Error("Email already exists");
      err.status = 409;
      return next(err);
    }

    const hashPassword = await bcrypt.hash(password, 12);

    // const avatar = req.file?.path ?? "uploads/avatar.png" 
    
      const avatar = req.files?.avatar?.map((file) => file.path) ?? "uploads/avatar.png";

    const docs = req.files?.docs?.map((file) => file.path) ?? [];
    const newUser = {
      ...value,
      id: users.length + 1,
      password: hashPassword,
      avatar,
      docs
    };

    users.push(newUser);
    fs.writeFileSync(userFilePath, JSON.stringify(users));

    // إرسال الإيميل بطريقة safe
    try {
      await sendMail(email, username, "Notification");
    } catch (err) {
      console.error("Email failed:", err.message);
    }

    res.status(201).json({
      message: "User created",
      data: newUser,
    });
  } catch (err) {
    next(err);
  }
}
// Update user
async function updateUser(req, res, next) {
  try {
    const id = Number(req.params.id);
    
    const { email, password } = req.body;

    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }

    // Check email
    if (email) {
      const emailExist = users.find((user) => user.email === email && user.id !== id);
      if (emailExist) {
        const err = new Error("Email already exists");
        err.status = 409;
        return next(err);
      }
      users[index].email = email;
    }

    // Update password
    if (password) {
      users[index].password = await bcrypt.hash(password, 12);
    }

    fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));

    res.json({
      message: "User updated successfully",
      data: users[index],
    });
  } catch (err) {
    const error = new Error("Internal Server Error");
    error.status = 500;
    next(error);
  }
}

// Delete user
function removeUser(req, res, next) {
  const id = Number(req.params.id);

  const index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    const error = new Error("User not found");
    error.status = 404;
    return next(error);
  }

  users.splice(index, 1);
  fs.writeFileSync(userFilePath, JSON.stringify(users));

  res.json({ message: "User deleted successfully" });
}

module.exports = {
  findAll,
  findOne,
  createUser,
  updateUser,
  removeUser,
};
