"use client";
import { useState } from "react";
import axios from "axios";
import Image from "next/image";

const ImageUploader = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/files/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setUploadStatus("Upload successful!");
        onUploadSuccess(response.data.mongoId); // Pass the ObjectId to parent
      } else {
        setUploadStatus("Upload failed.");
      }
    } catch (error) {
      console.error("Error uploading the file:", error);
      setUploadStatus("An error occurred during the upload.");
    }
  };

  const generateImage = () => {
    html2canvas(sectionRef.current).then((canvas) => {
      // Convert the canvas to a data URL
      const imgData = canvas.toDataURL("image/png");

      // Create a link element
      const link = document.createElement("a");
      link.href = imgData; // Set the href to the image data
      link.download = "download.png"; // Set the download attribute with a filename
      document.body.appendChild(link); // Append link to the body
      link.click(); // Programmatically click the link to trigger download
      document.body.removeChild(link); // Remove the link from the document
    });
  };

  return (
    <div>
      <div>
        <Image></Image>
      </div>
      <h1>Image Uploader</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && <img src={preview} alt="Image Preview" width="200" />}
        <button type="submit">Upload Image</button>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default ImageUploader;
