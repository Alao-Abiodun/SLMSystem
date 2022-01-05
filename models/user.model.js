const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please enter valid email..."],
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  block: {
    type: Boolean,
    required: true,
    default: false,
    select: false,
  },
  image: {
    type: String,
    lowercase: true,
    default:
      "https://res.cloudinary.com/oluwatobiloba/image/upload/v1628753027/Grazac/avatar_cihz37.png",
  },
  role: {
    type: String,
    enum: ["User", "Admin"],
    default: "User",
  },
  googleId: {
    type: String,
  },
  facebookId: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
