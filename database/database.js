const mongoose = require("mongoose");
//create DB func.
const connectToDB = async () => {
  try {
    //connect using url from .env
    await mongoose.connect(process.env.mongoUrl);
    console.log("database connected successfully.");
  } catch (e) {
    console.error("error occured!=>", e);
  }
};
module.exports = connectToDB;
