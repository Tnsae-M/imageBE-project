//import assets.
const express = require("express");
const router = express.Router();
const {
  signUpUser,
  signInUser,
  changePassword,
} = require("../controllers/authn-controllers");
const authMidWare = require("../middlewares/authMidWare");
//create routes for different auth functions.
router.post("/signup", signUpUser);
router.post("/signin", signInUser);
router.post("/changepassword", authMidWare, changePassword);
//export router
module.exports = router;
