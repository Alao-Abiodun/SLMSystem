const { OAuth2Client } = require("google-auth-library");
const Response = require("../libs/response");
const Error = require("../libs/error");
const { GOOGLE_CLIENT_ID, GOGOLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } =
  process.env;
const client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOGOLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL
);

const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { SECRET } = process.env;
const expiry = 360000;
const cookie = require("cookie-parser");
const nodemailer = require("nodemailer");

const URL =
  process.env.NODE_ENV === "development"
    ? process.env.FRONT_END_DEV_URL
    : process.env.FRONT_END_LIVE_URL;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // user: 'drsimplegraffiti@gmail.com',
    // pass: 'Godwin1#'
    user: "spaceetafrica@gmail.com",
    pass: "spaceet2021",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.googleAuth = async (req, res) => {
  console.log("========reqbody");
  console.log(req.body);
  console.log("========reqbody");
  try {
    const { token } = req.body;
    // Verify generated token
    const { payload } = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    // Get user data from payload
    const email = payload.email;
    const givenName = payload.given_name;
    const familyName = payload.family_name;
    const googleId = payload.sub;

    console.log({ email, givenName, familyName, googleId });

    //check whether user exist in database
    const userQuery = await User.findOne({
      email: email,
    });

    // If user exist, login directly
    if (userQuery !== null) {
      const user = userQuery;

      //create token
      const token = await jwt.sign(
        {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
        },
        SECRET,
        {
          expiresIn: "2d",
        }
      );
      console.log(token);
      // store token in cookie
      res.cookie("access-token", token);
      return Response(res).success(
        { data: { token, user_id: user._id, fullName: user.fullName } },
        200
      );
    }

    // Else register user and login
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash("SpaceEeet12345678", salt);

    const nUser = new User({
      fullName: `${givenName} ${familyName}`,
      email: email,
      password: defaultPassword,
      //provider: "google",
      googleId: googleId,
      emailToken: crypto.randomBytes(64).toString("hex"),
      isVerified: true,
      password: defaultPassword,
      confirm_password: defaultPassword,
    });

    const newUser = await nUser.save();

    if (!newUser) {
      throw Error("User creation failed", "INVALID REQUEST", 400);
    }

    //create token
    const userToken = await jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
      },
      SECRET,
      {
        expiresIn: "2d",
      }
    );
    console.log(token);
    // store token in cookie
    res.cookie("access-token", userToken);
    return Response(res).success({
      data: { userTOken, user_id: newUser._id, fullName: newUser.fullName },
    });
  } catch (error) {
    console.log(error);
    return Response(res).error(error.message, 500);
  }
};
