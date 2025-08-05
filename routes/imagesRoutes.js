//import important assests
const express = require("express");
const {
  uploadImage,
  getAllImg,
  deleteImg,
} = require("../controllers/image-control");
const authMidWare = require("../middlewares/authMidWare");
const adminMidWare = require("../middlewares/adminMidWare");
const uploadMidWare = require("../middlewares/uploadMidWare");
//create router
const router = express.Router();
//create routes
//upload route
router.post(
  "/upload",
  authMidWare,
  adminMidWare,
  uploadMidWare.single("image"),
  uploadImage
);
//get all images route
router.get("/getallimages", authMidWare, adminMidWare, getAllImg);
//delete image route
router.delete("/delete/:id", authMidWare, adminMidWare, deleteImg);
//export the router
module.exports = router;
