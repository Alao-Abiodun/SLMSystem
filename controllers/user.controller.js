const User = require("../models/user.model");
const Response = require("../libs/response");
const Error = require("../libs/error");
const { passwordHash } = require("../libs/bcrypt");

exports.userSignUp = async (req, res) => {
  try {
    const user = req.body;
    user.password = await passwordHash(user.password);
    const newUser = User.create(user);
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
