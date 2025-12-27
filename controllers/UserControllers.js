const fs = require("fs");
const path = require("path");
const { userValidate } = require("../validations/userValidate");
const bcrypt = require("bcrypt");
const { response } = require("express");

let users = [];


const userFilePath = path.join(__dirname, "..", "db", "users.json");


if (fs.existsSync(userFilePath)) {
  users = JSON.parse(fs.readFileSync(userFilePath, "utf8"));
} else {
  fs.writeFileSync(userFilePath, "[]");
}

// Get all users
function findAll(req, res) {
  res.json({ message: "User list", data: [users] });
}

// Get one user
function findOne(req, res, next) {
  const id = req.params.id;
  const user = users.find((user) => user.id == id);

  if (!user) {
    const error = new Error("User not found")
    error.status(404)
    return next(error);
  }

  res.json({ message: "User found", data: [user] });
}

// Create user
function createUser(req, res, next) {

const {error}=userValidate(req.body)

if(error){
  return res.status(400).json({message : error.message})
}

const { email, password } = req.body;

const existUser = users.find((user) => user.email == email);
  if (existUser) {
    const error = new Error("Email already exists");
    error.status(409);
    return next(error);
  }
  const hashpassword = bcrypt.hash(password , 12)
  const newUser = { id: users.length + 1, email, password : hashpassword };
  users.push(newUser);

  fs.writeFileSync(userFilePath, JSON.stringify(users));

  res.json({ message: "User created", data: [newUser] });
}

// Update user
function updateUser(req, res, next) {
  const id = req.params.id;
  const { email, password } = req.body;

  const index = users.findIndex((user) => user.id == id);
  if (index === -1) return next(res.status(404));

  if (email) {
    const emailExist = users.find(
      (user) => user.email === email && user.id != id
    );
    if (emailExist) return next(new Error(res.status(409)));
  }

  users[index] = {
    ...users[index],
    ...(email && { email }),
    ...(password && { password }),
  };

  fs.writeFileSync(userFilePath, JSON.stringify(users));

  res.json({ message: "User updated successfully", data: users[index] });
}

// Delete user
function removeUser(req, res, next) {
  const id = req.params.id;

  const index = users.findIndex((user) => user.id == id);
  if (index === -1) return next(new Error("User not found"));

  users.splice(index, 1);
  fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));

  res.json({ message: "User deleted successfully" });
}

module.exports = {
  findAll,
  findOne,
  createUser,
  updateUser,
  removeUser,
};
