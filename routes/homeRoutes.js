//import resources
const express = require("express");
const authMidWare = require("../middlewares/authMidWare");
const router = express.Router();
//Home route
router.get("/welcome", authMidWare, (req, res) => {
  const { userId, userName, role } = req.userInfo;
  res.json({
    message: "Welcome to homepage.",
    user: {
      userName: userName,
      Id: userId,
      Role: role,
    },
  });
});
//export the function
module.exports = router;
