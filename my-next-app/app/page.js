"use client";
import html2canvas from "html2canvas";
import Image from "next/image";
import logo from "../public/firstFloor.png"; // Assuming you are importing the image
import { useRef, useState } from "react"; // Import useState for progress tracking
import axios from "axios";
import Link from "next/link";

export default function UserPage({ id }) {
  const sectionRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0); // State for upload progress
  const [fileId, setFileId] = useState(null); // State for storing the file ID

  const uploadToCloudinary = async (imageBlob) => {
    const formData = new FormData();
    formData.append("file", imageBlob);
    formData.append("upload_preset", "your_upload_preset");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/files/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            const percent = Math.floor((loaded * 100) / total);
            setUploadProgress(percent); // Update the progress state
          },
        }
      );

      if (response.status === 200) {
        console.log("Cloudinary Response: ", response.data);
        setFileId(response.data.file._id); // Store the MongoDB ObjectId
        return response.data.file._id; // Return the file ID for later use
      }
    } catch (error) {
      console.error("Error uploading the file:", error);
    } finally {
      setUploadProgress(0); // Reset progress after upload
    }
  };

  const generateAndUploadImage = async () => {
    const imageElement = sectionRef.current.querySelector("img");
    const { width, height } = imageElement.getBoundingClientRect(); // Get image dimensions

    const canvas = await html2canvas(sectionRef.current, {
      width: width,
      height: height,
      useCORS: true, // Enable CORS for external images if necessary
      scale: 1, // Ensure no extra scaling
    });

    canvas.toBlob(async (blob) => {
      if (blob) {
        const id = await uploadToCloudinary(blob); // Upload the Blob to Cloudinary and get the ID
        if (id) {
          shareOnWhatsApp(id); // Share on WhatsApp with the received file ID
        }
      }
    }, "image/png");
  };

  const shareOnWhatsApp = (id) => {
    const message = encodeURIComponent(`http://localhost:3000/users/${id}`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  return (
    <div
      style={{
        width: "90vw",
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid black",
        margin: "auto",
      }}
    >
      <div
        ref={sectionRef}
        style={{ width: "fit-content", height: "fit-content" }}
      >
        <Image src={logo} alt="Floor Plan" width={200} height={200} />
      </div>
      <Link
        href="#"
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded text-center"
        onClick={(e) => {
          e.preventDefault(); // Prevent default link behavior
          generateAndUploadImage(); // Start image capture and upload
        }}
      >
        Upload & share on WhatsApp
      </Link>
      {uploadProgress > 0 && (
        <div className="mt-2 w-full bg-gray-200 rounded-full">
          <div
            className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
            style={{ width: `${uploadProgress}%` }}
          >
            {uploadProgress}%
          </div>
        </div>
      )}
    </div>
  );
}
