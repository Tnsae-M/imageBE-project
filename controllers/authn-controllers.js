//import assets.
const user = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
//controllers for authentication and authorization.

//signUp controller
const signUpUser = async (req, res) => {
  try {
    //first we request frontend info. using req.body
    const { userName, email, password, role } = req.body;
    //check if user exists in DB.
    //create logic where the same password or username is checked before creating a new user.
    const checkUser = await user.findOne({ $or: [{ userName }, { password }] });
    //conditional logic
    if (checkUser) {
      return res.status(400).json({
        status: "failed.",
        message: "Username or password already exists.Change both or one!",
      });
    }
    //hash the user pass
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(password, salt);
    //create a new user.
    const newUser = new user({
      userName,
      email,
      password: hashedPass,
      role: role || "user",
    });
    //save the new user.
    await newUser.save();
    //use logic
    if (newUser) {
      res.status(201).json({
        status: "success",
        message: "user signed up successfully.",
      });
    } else {
      res.status(400).json({
        status: "failed",
        message: "user signup failed!.",
      });
    }
  } catch (er) {
    console.log("error occured!", er);
    res.status(500).json({
      status: "failed!",
      message: "something went wrong!",
    });
  }
};
//signin controller
const signInUser = async (req, res) => {
  try {
    //extract username and password from body.
    const { userName, password } = req.body;
    //check if username exists in DB or Not.
    const checkUser = await user.findOne({ userName });
    //condition
    if (!checkUser) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid username. please write the correct username",
      });
    }
    //check if pass is correct or not.
    const checkPassword = await bcrypt.compare(password, checkUser.password);
    //condition
    if (!checkPassword) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid password. please write the correct password.",
      });
    }
    //now create a token specifically a bearer token
    const accessToken = jwt.sign(
      {
        userId: checkUser._id,
        userName: userName,
        role: checkUser.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "15m",
      }
    );
    //return token to frontend
    res.status(200).json({
      status: "successful",
      message: "Logged in successfully",
      accessToken,
    });
  } catch (er) {
    console.log("error occured!", er);
    res.status(500).json({
      status: "failed!",
      message: "something went wrong!",
    });
  }
};
//change pass
const changePassword = async (req, res) => {
  //get the current user ID.
  const userId = req.userInfo.userId;
  //get old and new password from front
  const { oldPass, newPass } = req.body;
  //get the current user
  const User = await user.findById(userId);

  if (!User) {
    return res.status(400).json({
      success: false,
      message: "user not found.",
    });
  }
  //verify if the old pass is correct.
  const ispasswordMatch = await bcrypt.compare(oldPass, User.password);
  if (!ispasswordMatch) {
    return res.status(400).json({
      success: false,
      message: " old password is incorrect.",
    });
  }
  //now salt and hash the new pass
  const salt = await bcrypt.genSalt(10);
  const newHashedPass = await bcrypt.hash(newPass, salt);
  //change password
  User.password = newHashedPass;
  //save the password in the DB
  await User.save();
  res.status(200).json({
    success: true,
    message: "password changed successfully.",
  });
};
module.exports = { signInUser, signUpUser, changePassword };
