const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Response = require("../libs/response");
const Error = require("../libs/error");
const { SECRET } = process.env;
const expiry = 360000;

exports.isRegisteredWithGoogle = async (req, res) => {
  const { googleId } = req.body;
  try {
    const existingUser = await User.findOne({ googleId });
    if (existingUser) {
      throw Error("User exist, please signin", "BAD REQUEST", 400);
    }

    if (existingUser.googleId) {
      throw Error("User email already in use", "BAD REQUEST", 400);
    } else {
      //create token
      const token = await jwt.sign(
        {
          id: existingUser._id,
          googleId: existingUser.googleId,
        },
        SECRET,
        {
          expiresIn: "2h",
        }
      );
      const createdUser = await existingUser.save();
      console.log(token);
      // store token in cookie
      res.cookie("access-token", token);
      return Response(res).success(
        {
          data: {
            token,
            user_id: existingUser._id,
            googleId: existingUser.googleId,
          },
        },
        200
      );
      // res.redirect('/profile');
    }
  } catch (error) {
    console.log(error);
  }
};
