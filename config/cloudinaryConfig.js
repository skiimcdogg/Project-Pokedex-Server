const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
// require('dotenv').config()

// giving access to your cloudinary account
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// cloudinary : SAAS platform : specialized in images hosting (tools : metadata, image analyzing ...)
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowed_formats: ["jpg", "png"],
    folder: "pokedex-gallery", // The name of the folder in cloudinary
    // resource_type: 'raw', // => this is in case you want to upload other type of files, not just images
  },
});

const fileUploader = multer({ storage });

// a middleware designed to parse file from requests and associate to req.file
module.exports = fileUploader;
