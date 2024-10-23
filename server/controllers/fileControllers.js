// controllers/fileController.js
const { cloudinary } = require("../lib/cloudinary");
const File = require("../model/file.model.js");
const multer = require("multer");

// Configure Multer for file handling
const storage = multer.memoryStorage(); // In-memory storage
const upload = multer({ storage });

// Upload file to Cloudinary and save the file metadata in MongoDB
const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const fileBuffer = file.buffer.toString("base64");
    const mimeType = file.mimetype;

    // Prepare the file URI
    const fileUri = `data:${mimeType};base64,${fileBuffer}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileUri, {
      resource_type: "auto",
      folder: "product-images",
      use_filename: true,
    });

    // Save file data to MongoDB
    const newFile = new File({
      filename: file.originalname,
      fileUrl: result.secure_url,
      cloudinaryId: result.public_id,
      fileType: file.mimetype,
    });

    await newFile.save();

    res.status(200).json({
      message: "File uploaded successfully",
      file: newFile,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFile = async (req, res) => {
  try {
    const imageId = req.params.id; // Get ID from the URL
    const file = await File.findById(imageId); // Fetch the image from the database

    if (!file) {
      return res.status(404).json({ message: "Image not found" });
    }

    return res.json({ fileUrl: file.fileUrl }); // Return the image URL
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
module.exports = { upload, uploadFile, getFile };
