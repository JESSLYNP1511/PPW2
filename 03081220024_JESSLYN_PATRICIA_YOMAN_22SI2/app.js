require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const db = require("./config/database");
const jwt = require("jsonwebtoken");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Set EJS as View Engine
app.set("view engine", "ejs");

// Set User in Views (Check token in cookies)
app.use((req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            req.user = jwt.verify(token, process.env.JWT_SECRET);
            res.locals.user = req.user;
        } catch (error) {
            req.user = null;
            res.locals.user = null;
        }
    } else {
        req.user = null;
        res.locals.user = null;
    }
    next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Home Redirect
app.get("/", (req, res) => res.redirect("/tasks"));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
