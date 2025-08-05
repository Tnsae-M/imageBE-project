//import resources
const image = require("../models/images");
const { uploadToCloudinary } = require("../helpers/cloudinaryHelpers");
const cloudinary = require("../config/cloudinary");
// const user = require("../models/user");
//uploading controller
const uploadImage = async (req, res) => {
  try {
    //handler if img is missing from request.
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "image is not uploaded. please try after uploading image.",
      });
    }
    //upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);
    //store img info and user id to DB.
    const newImgUpload = new image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });
    //call the new image upload func
    await newImgUpload.save();
    /*optional: u can use file system(fs)to delete image after uploading.

      fs.unlinksync(req.file.path);
      note: import fs first!!!
      */
    res.status(200).json({
      success: true,
      message: "image upload successful.",
      image: newImgUpload,
    });
  } catch (er) {
    res.status(500).json({
      success: false,
      message: "s'th went wrong.",
    });
  }
};
//get all img controllers
const getAllImg = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "CreatedAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImg = await image.countDocuments();
    const totalPages = Math.ceil(totalImg / limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder;
    //request images from DB
    const fetchImg = await image.find().sort(sortObj).skip(skip).limit(limit);
    //logic
    if (fetchImg) {
      res.status(201).json({
        success: true,
        message: "images retrieved successfully.",
        currentPage: page,
        totalImg: totalImg,
        totalPages: totalPages,
        images: fetchImg,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "no images found.",
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "S'th went wrong. please try again.",
    });
  }
};
//delete image controller
const deleteImg = async (req, res) => {
  try {
    //fetch img and user using ID.
    const currentImgId = req.params.id;
    const userId = req.userInfo.userId;
    //fetch image to delete
    const Img = await image.findById(currentImgId);
    if (!Img) {
      return res.status(404).json({
        success: false,
        message: "image not found.choose an existing image.",
      });
    }
    //check if img is uploaded by the right user.
    if (Img.uploadedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "you don't have permission to delete. ",
      });
    }
    //delete from cloudinary
    await cloudinary.uploader.destroy(Img.publicId);
    //delete from mongoDB
    await image.findByIdAndDelete(currentImgId);
    //finish message
    res.status(200).json({
      success: true,
      message: "image deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "something went wrong.",
    });
    console.log("error=> ", err);
  }
};
//export the function
module.exports = { uploadImage, getAllImg, deleteImg };
