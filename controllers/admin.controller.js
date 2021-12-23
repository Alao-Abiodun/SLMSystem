const Admin = require("../models/admin.model");
const Response = require("../libs/response");
const Error = require("../libs/error");
const { passwordHash, passwordCompare } = require("../libs/bcrypt");

exports.adminSignUp = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const userExist = await Admin.findOne({ email });
    if (userExist) {
      throw Error("User already exists", "BAD REQUEST", 401);
    }
    const hashedPassword = await passwordHash(password);
    const newAdmin = new Admin({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });
    const payload = {
      _id: newAdmin._id,
      email: newAdmin.email,
      role: newAdmin.role,
    };
    await newAdmin.save();
    return Response(res).success({ data: newAdmin }, 201);
  } catch (error) {
    return Response(res).error(error.message, 500);
  }
};

exports.adminSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw Error("Admin does not exist", "BAD REQUEST", 401);
    }
    const passwordCheck = await passwordCompare(password, admin.password);
    if (!passwordCheck) {
      throw Error("Password are not correct", "BAD REQUEST", 401);
    }
    return Response(res).success({ message: "Admin login successfully" }, 200);
  } catch (error) {
    return Response(res).error(error.message, 500);
  }
};
