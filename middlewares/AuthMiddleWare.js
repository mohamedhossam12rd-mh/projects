const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const AuthMiddleWare = (request, response, next) => {
  const authHeader = request.headers.authorization;

  // 1️⃣ Check header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  // 2️⃣ Extract token
  const token = authHeader.split(" ")[1];

  try {
    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Attach user to request
    request.user = decoded;

    next();
  } catch (error) {
    return response.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = {AuthMiddleWare};
