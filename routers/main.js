

const express = require("express");
const router = express.Router();

const {
    getHome,
    getSevens,
    getProfile,
    getProjects,
    logout
} = require("../controllers/main");

// These paths are relative to /main
router.get("/projects",getProjects);
router.get("/home", getHome);
router.get("/sevens", getSevens);
router.get("/profile", getProfile);
router.post('/logout',logout)
module.exports = router;