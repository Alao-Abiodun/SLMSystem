const express = require("express");
const router = express.Router();
const {
  userSignUp,
  userSignIn,
  uploadUserProfilePicture,
} = require("../controllers/user.controller");
const uploadImage = require("../libs/multer");

const { validateUserToken } = require("../middleware/auth");

router.post("/signup", userSignUp);
router.post("/login", userSignIn);
router.patch(
  "/upload-user-profile-picture",
  uploadImage.single("image"),
  validateUserToken,
  uploadUserProfilePicture
);

module.exports = router;
