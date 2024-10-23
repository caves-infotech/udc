// routes/fileRoutes.js
const express = require("express");
const router = express.Router();
const {
  upload,
  uploadFile,
  getFile,
} = require("../controllers/fileControllers.js");

// Define the POST route for file upload
router.post("/upload", upload.single("file"), uploadFile);
router.get("/getFile/:id", getFile);

module.exports = router;
