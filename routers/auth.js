
const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getregisterUser,
    getloginUser
} = require("../controllers/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/register", getregisterUser);
router.get("/login", getloginUser);

module.exports = router;
