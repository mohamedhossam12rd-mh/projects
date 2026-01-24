const { userValidate } = require("../validations/userValidate");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
// const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const sendMail = require("../utils/sendMails");
dotenv.config();
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
    const { error, value } = userValidate.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((err) => err.message);
      error.message = messages;
      return next(error);
    }

    const { email, password} = value;

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
      id: Date.now(),
      password: hashPassword,
      avatar,
      docs,
    };

    users.push(newUser);
    fs.writeFileSync(userFilePath, JSON.stringify(users));

    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email required" });
      }

      const result = await sendMail(email);
      if(result.success){
        return res.json({message : "Mail sent" })
      }
    } catch (error) {
      console.error("Email failed:", error.message);
    }
    // const secret = process.env.JWT_SECRET || "secret";
    // const payload = { id: newUser.id, role: newUser.role };
    // const expiredate = process.env.JWT_EXPIREDATE_IN || "7d";
    // const token = jwt.sign(payload, secret, { expiresIn: expiredate });
    res.status(201).json({
      message: "User created",
      data: newUser,
      // token
    });
  } catch (err) {
    const error = new Error("Internal Server Error");
    error.status = 500;
    next(error);
  }
}
// Update user
async function updateUser(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { email, password , username , age , role} = req.body;

    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }

    // Check email
    if (email) {
      const emailExist = users.find(
        (user) => user.email === email && user.id !== id,
      );
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

    //Update Avatar
    if (req.files?.avatar) {
      users[index].avatar = req.files.avatar.map(file=>file.path);
    }

    //Update Docs
    if (req.files?.docs) {
      users[index].docs = req.files.docs.map(file=>file.path);
    }


        // Update username with validation
    if (username !== undefined) {
      if (username.trim().length < 3) {
        const err = new Error("Username must be at least 3 characters long");
        err.status = 400;
        return next(err);
      }
      users[index].username = username.trim();
    }

    // Update age with validation
    if (age !== undefined) {
      const ageNum = Number(age);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
        const err = new Error("Age must be a valid number between 0 and 120");
        err.status = 400;
        return next(err);
      }
      users[index].age = ageNum;
    }

if (role !== undefined) {
  if ( 
    req.user.role !== "super_admin" &&
    req.user.role !== "admin" &&
    req.user.role !== "user") {
    return res.status(403).json({ message: "Access Denide" });
  }
  users[index].role = role;
}


    fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));

    res.status(200).json({
      message: "User updated successfully",
      data: users[index],
    });
  } catch (err) {
  
    console.error("Update user error:", err);
    const error = new Error("Internal Server Error");
    error.status = 500;
    next(error);
  }
}


// async function updateAvatar(req, res, next) {
//   try {
//     console.log("PARAM:", req.params.id);
//     console.log("FILE:", req.file);

//     const userId = Number(req.params.id);

//     const user = users.find((u) => u.id === userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     user.avatar = req.file.path;
//   

//     res.json({
//       message: "Avatar updated",
//       user,
//     });
//   } catch (err) {
//     next(err);
//   }
// }
async function updateAvatar(req, res, next) {
  try {
    console.log("PARAM:", req.params.id);
    console.log("FILES:", req.files); // تغيير من req.file إلى req.files

    const userId = Number(req.params.id);
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // التحقق من وجود الملفات
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    if (req.files.avatar) {
      user.avatar = req.files.avatar.map(file => file.path);
    }

    if (req.files.docs) {
      user.docs = req.files.docs.map(file => file.path);
    }

    res.json({
      message: "Files uploaded successfully",
      user,
    });
  } catch (err) {
    next(err);
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
  updateAvatar,
};
