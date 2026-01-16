const fs = require("fs");
const path = require("path");
let users = [];
const usersPath = path.join(__dirname, "..","db","users.json");

const getUsers = () => {
  return JSON.parse(fs.readFileSync(usersPath, "utf-8"));
};

const saveUsers = (users) => {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
};

module.exports = { getUsers, saveUsers };
