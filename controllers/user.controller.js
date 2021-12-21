const User = require("../models/user.model");
const Response = require("../libs/response");
const Error = require("../libs/error");
const { passwordHash } = require("../libs/bcrypt");

exports.userSignUp = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const { image } = req.files;
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
  } catch (error) {
    return Response(res).error(error.message, 500);
  }
};
