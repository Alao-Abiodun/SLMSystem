const express = require("express");
const router = express.Router();
const { userSignUp, userSignIn } = require("../controllers/user.controller");

router.post("/signup", userSignUp);
router.post("/login", userSignIn);

module.exports = router;
