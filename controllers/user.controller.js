const User = require("../models/user.model");
const Response = require("../libs/response");
const Error = require("../libs/error");
const { passwordHash, passwordCompare } = require("../libs/bcrypt");
const { sendMail } = require("../libs/sendMail");
const { jwtSign } = require("../libs/jwt");
const verificationTemplate = require("../helpers/verificationTemplate");

// const { JWT_SECRET } = process.env;

exports.userSignUp = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const userExist = await User.findOne({ email });
    const { image } = req.files;
    if (userExist) {
      throw Error("User already exists", "BAD REQUEST", 401);
    }
    image.mv("./public/uploads/images/" + "" + image.name);
    const hashedPassword = await passwordHash(password);
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      image: image.name,
    });
    const payload = {
      _id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    };
    const token = jwtSign(payload);
    // let hostname = req.headers.host;
    // let verificationLink = `http://${hostname}/verify/${token}`;
    // const message = verificationTemplate(newUser.firstname, verificationLink);
    // await sendMail(message, "Activate your account", newUser.email);
    await newUser.save();
    return Response(res).success({ data: newUser, token }, 201);
  } catch (error) {
    console.log(error);
    return Response(res).error(error.message, 500);
  }
};

exports.userSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw Error("User does not exist", "BAD REQUEST", 401);
    }
    const passwordCheck = await passwordCompare(password, user.password);
    if (!passwordCheck) {
      throw Error("Password are not correct", "BAD REQUEST", 401);
    }
    return Response(res).success({ message: "User login successfully" }, 200);
  } catch (error) {
    return Response(res).error(error.message, 500);
  }
};
