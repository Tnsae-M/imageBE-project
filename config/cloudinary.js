//import cloudinary
const cloudinary = require("cloudinary");
//use .config
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.cloudinary_API_KEY,
  api_secret: process.env.cloudinary_pass,
});
module.exports = cloudinary;
