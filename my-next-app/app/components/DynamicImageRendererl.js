import React, { useEffect, useState } from "react";

const DynamicImageRenderer = ({ id }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`/api/images/${id}`);
        if (!response.ok) {
          throw new Error("Image not found");
        }
        const data = await response.json();
        setImage(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!image) {
    return <div>No image found.</div>;
  }

  return (
    <div className="flex justify-center items-center">
      <img
        src={image.fileUrl}
        alt="Dynamic"
        style={{ width: "70vw", height: "60vh", border: "5px solid red" }}
        className="object-contain"
      />
    </div>
  );
};

export default DynamicImageRenderer;
