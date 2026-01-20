const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()} - ${file.originalname}`)
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "avatar") {
    if (
      file.mimetype.startsWith("image/jpeg") ||
      file.mimetype.startsWith("image/png")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Avatar should be an image (jpg or png)"), false);
    }
  } else if (file.fieldname === "docs") {
    cb(null, true);
  } else {
    cb(new Error("Unexpected field"), false);
  }
};



const uploader = multer({ 
  storage, 
  fileFilter
});


module.exports = { uploader };



