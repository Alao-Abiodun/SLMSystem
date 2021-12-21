const express = require("express");
const router = express.Router();
const { adminSignUp, adminSignIn } = require("../controllers/admin.controller");

router.post("/signup", adminSignUp);
router.post("/login", adminSignIn);

module.exports = router;
