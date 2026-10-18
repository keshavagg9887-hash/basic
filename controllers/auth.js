
const path = require("path");
const bcrypt = require("bcrypt");
const { pool } = require("../connection");
// GET /auth/register
const getregisterUser = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/reg.html"));
};
// GET /auth/login
const getloginUser = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/login.html"));
};
// POST /auth/register
const registerUser = async (req, res) => {
    const { fullname, email, password } = req.body;
    const confirmPassword = req.body["confirm-password"];

    if (!fullname || !email || !password || !confirmPassword) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            message: "Passwords do not match"
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters"
        });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = fullname.trim();

    if (!normalizedName || !normalizedEmail) {
        return res.status(400).json({
            message: "Name and email cannot be empty"
        });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 12);

        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash)
             VALUES ($1, $2, $3)
             RETURNING id, name, email, created_at`,
            [normalizedName, normalizedEmail, passwordHash]
        );

        return res.status(201).json({
            message: "Registration successful",
            user: result.rows[0]
        });

    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        console.error("Registration error:", error.message);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// POST /auth/login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    try {
        const result = await pool.query(
            `SELECT id, name, email, password_hash, created_at
             FROM users
             WHERE email = $1`,
            [email.trim().toLowerCase()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
// Password is correct — create the session
req.session.regenerate((err) => {
    if (err) {
        console.error("Session creation error:", err);

        return res.status(500).json({
            message: "Session creation failed"
        });
    }

    req.session.userId = user.id;
    req.session.userName = user.name;

    // Save session in PostgreSQL before redirecting
    req.session.save((err) => {
        if (err) {
            console.error("Session save error:", err);

            return res.status(500).json({
                message: "Session save failed"
            });
        }

        return res.redirect("/main/home");
    });
});
        

    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getregisterUser,
    getloginUser
};
