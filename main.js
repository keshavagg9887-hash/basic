require('dotenv').config();
const express = require('express');
const app = express();
const path = require("path");
const mainRouter = require('./routers/main');
const authRouter = require('./routers/auth');
const session = require("express-session");
const PgSession = require("connect-pg-simple")(session);
const authMiddleware = require('./middlewares/auth');
const { pool } = require("./connection"); // your existing PostgreSQL pool

// Trust first proxy on Render/cloud hosts for secure cookies
app.set('trust proxy', 1);

app.use(session({
    name: "sid",
    store: new PgSession({
        pool,
        tableName: "user_sessions",
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET || "fallback_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: "auto", // Automatically true on HTTPS (Render), false on HTTP (localhost)
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000
    }
}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "views")));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.use('/main', authMiddleware, mainRouter);
app.use('/auth', authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
