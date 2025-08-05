//import resources
const express = require("express");
//create middleware logic
const adminMidWare = (req, res, next) => {
  //use user info from auth or req.userInfo.role
  const { role } = req.userInfo;

  //used as an extra protection for admin page.
  //check if user is admin
  if (req.userInfo.role != "admin") {
    return res.status(403).json({
      status: "failed",
      message: "access denied. user is not an admin.",
    });
  }
  next();
};
module.exports = adminMidWare;
