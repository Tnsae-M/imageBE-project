//import resources
const cloudinary = require("../config/cloudinary");
//create the upload to cloud logic
const uploadToCloudinary = async (filePath) => {
  try {
    //use cloud uploader
    const result = await cloudinary.uploader.upload(filePath);
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (er) {
    console.error("error occured: ", er);
    throw new Error("error while uploading Img.");
  }
};
//export functions
module.exports = {
  uploadToCloudinary,
};
//checkpoint 6:15 hr
