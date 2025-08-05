//import resources
const jwt = require("jsonwebtoken");
require("dotenv").config();
//create auth midWare for use as a condition before routes excution.
const authMidWare = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // console.log(authHeader);
  //split header to get token
  const token = authHeader && authHeader.split(" ")[1];
  // console.log("\n", token);
  if (!token) {
    return res.status(401).json({
      status: "failed",
      message: "Token not found. please try again.",
    });
  }
  //checking since there was env var mismatch
  // console.log("Token: ", token);
  // console.log("Secret Key: ", process.env.JWT_SECRET_KEY);

  //deocding token which is failing right now.
  try {
    //verify token
    //side note: when copying token don't copy the quotation mark!
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decodedToken);
    req.userInfo = decodedToken;
    next();
  } catch (er) {
    console.log("error occured!=>", er);
    return res.status(500).json({
      status: "failed",
      message: "Invalid or expired Token. Access denied.",
    });
  }
};
module.exports = authMidWare;
