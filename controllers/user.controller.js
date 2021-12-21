const User = require("../models/user.model");
const Response = require("../libs/response");
const Error = require("../libs/error");
const { passwordHash, passwordCompare } = require("../libs/bcrypt");

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
    await newUser.save();
    return Response(res).success({ data: newUser }, 201);
  } catch (error) {
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
