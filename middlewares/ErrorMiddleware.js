function errorMiddleware(error, request, response, next) {
  console.error(error.stack);

  response.send(error.message);
}

module.exports = { errorMiddleware };