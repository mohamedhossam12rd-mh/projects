const multer = require("multer")


const storage = multer.diskStorage({
    destination : (request , file , cb) => cb(null , "uploads/"),
    filename : (request , file , cb) => cb(null , `${Date.now()} - ${file.originalname}`)
})

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "avatar") {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(new Error("Only PNG and JPEG allowed for avatar"), false);
    }
  } else if (file.fieldname === "docs") {
    if (file.mimetype === "application/pdf" || file.mimetype === "application/msword" || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF or Word files allowed for docs"), false);
    }
  } else {
    cb(null, false);
  }
};


const uploader = multer({storage , fileFilter})

module.exports = uploader