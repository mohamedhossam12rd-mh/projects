const express = require("express");
const { errorMiddleware } = require("./middlewares/ErrorMiddleware");
const userRoutes = require("./routers/UserRoutes");
const app = express();

app.use(express.json());

app.use("/users", userRoutes);
app.use(errorMiddleware);
app.use((error, request, respons, next) => {
  respons.status(error.statu).json({
    message: err.message || "Something went wrong",
  });
});
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING PORT ${PORT}`);
});
