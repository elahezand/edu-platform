const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const errorHandler = require("./middlewares/errorHandeler");


const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const categoryRouter = require("./routes/category");
const sessionRouter = require("./routes/session");
const courseRouter = require("./routes/course");
const commentRouter = require("./routes/comment");
const articleRouter = require("./routes/article");
const contactRouter = require("./routes/contact")

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/courses/covers', express.static(path.join(__dirname, "public", "courses", "covers")));
app.use('/sessions/videos', express.static(path.join(__dirname, "public", "sessions", "videos")));
app.use('/users/avatars', express.static(path.join(__dirname, "public", "users", "avatars")));
app.use('/articles/covers', express.static(path.join(__dirname, "public", "articles", "covers")));


// Routes
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/categories", categoryRouter);
app.use("/sessions", sessionRouter);
app.use("/courses", courseRouter);
app.use("/comments", commentRouter);
app.use("/articles",articleRouter );
app.use("/contact",contactRouter );



app.use(errorHandler);


module.exports = app;
