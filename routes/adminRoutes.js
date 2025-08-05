//import resources
const express = require("express");
const authMidWare = require("../middlewares/authMidWare");
const adminMidWare = require("../middlewares/adminMidWare");
const router = express.Router();
//use the router to create a simple route.
router.get("/welcome", authMidWare, adminMidWare, (req, res) => {
  res.json({
    message: "welcome to admin page.",
  });
});
module.exports = router;
