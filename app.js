const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const errorHandler = require("./middlewares/errorHandeler");


const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/courses/covers', express.static(path.join(__dirname, "public", "courses", "covers")));

// Routes
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.use(errorHandler);


module.exports = app;
