const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const errorHandler = require("./middlewares/errorHandeler");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const categoryRouter = require("./routes/category");
const sessionRouter = require("./routes/session");
const courseRouter = require("./routes/course");
const commentRouter = require("./routes/comment");
const articleRouter = require("./routes/article");
const contactRouter = require("./routes/contact");
const departmentRouter = require("./routes/department");
const infoRouter = require("./routes/info");
const menuRouter = require("./routes/menu");
const newsLetterRouter = require("./routes/newsletter");
const notificationRouter = require("./routes/notification");
const offRouter = require("./routes/off");
const ticketRouter = require("./routes/ticket");
const searchRouter = require("./routes/search");
const orderRouter = require("./routes/order");


const app = express();

const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

app.use('/public', express.static(path.join(__dirname, "public")));
app.use('/courses/covers', express.static(path.join(__dirname, "public", "courses", "covers")));
app.use('/sessions/videos', express.static(path.join(__dirname, "public", "sessions", "videos")));
app.use('/users/avatars', express.static(path.join(__dirname, "public", "users", "avatars")));
app.use('/articles/covers', express.static(path.join(__dirname, "public", "articles", "covers")));

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/sessions", sessionRouter);
apiRouter.use("/courses", courseRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/contact", contactRouter);
apiRouter.use("/departments", departmentRouter);
apiRouter.use("/info", infoRouter);
apiRouter.use("/menu", menuRouter);
apiRouter.use("/newsletter", newsLetterRouter);
apiRouter.use("/notification", notificationRouter);
apiRouter.use("/off", offRouter);
apiRouter.use("/tickets", ticketRouter);
apiRouter.use("/search",searchRouter)
apiRouter.use("/orders",orderRouter)



app.use("/api", apiRouter);

app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found!" });
});

app.use(errorHandler);

module.exports = app;