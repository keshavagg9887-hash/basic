
const path = require("path");

const getHome = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/main.html"));
};

const getSevens = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/members.html"));
};

const getProfile = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/profile.html"));
};

const getProjects = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/projects.html"));
};


const logout = (req, res, next) => {
    if (!req.session) {
        return res.redirect("/auth/login");
    }

    req.session.destroy((err) => {
        if (err) {
            console.error("Logout error:", err);

            return res.status(500).send("Unable to log out. Please try again.");
        }

        res.clearCookie("sid", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });

        return res.redirect("/auth/login");
    });
};

module.exports = {
    getHome,
    getSevens,
    getProfile,
    getProjects
    ,logout 
};
