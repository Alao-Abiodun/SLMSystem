const express = require("express");
const router = express.Router();
const {
  adminSignUp,
  adminSignIn,
  blockUser,
} = require("../controllers/admin.controller");

const { validateUserToken, validateAdmin } = require("../middleware/auth");

router.post("/signup", adminSignUp);
router.post("/login", adminSignIn);
router.delete("/block", validateUserToken, validateAdmin, blockUser);

module.exports = router;
