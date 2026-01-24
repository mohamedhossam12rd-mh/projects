const express = require("express");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const { errorMiddleware } = require("./middlewares/ErrorMiddleware");
const userRoutes = require("./routers/UserRoutes");
const AuthRoutes = require("./routers/AuthRoutes")
const cors = require("cors")
const path = require("path")
dotenv.config();
const app = express();
app.use(cors({origin : "*"}))

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);


app.use("/views",express.static(path.join(__dirname , "/views")))
app.use("/users", userRoutes);
app.use("/Auth"  ,AuthRoutes)

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
