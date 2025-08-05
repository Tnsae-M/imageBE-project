//import resources
const multer = require("multer");
const path = require("path");
//create a disk storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
//file filtering function
const checkFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("please upload only images"));
  }
};
//create middleware(multer middleware)
module.exports = multer({
  storage: storage,
  FileFilter: checkFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, //5mb
  },
});
