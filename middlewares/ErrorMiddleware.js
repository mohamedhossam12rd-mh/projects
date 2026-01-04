function errorMiddleware(error, req, res, next) {
  console.error(error.stack);

  // لو error.status مش موجود أو مش رقم، استخدم 500
  const statusCode = Number(error.status) || 500;

  res.status(statusCode).json({
    message: error.message || "Something went wrong",
  });
}

module.exports = { errorMiddleware };
