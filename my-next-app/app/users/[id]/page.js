import Image from "next/image";

async function fetchImage(id) {
  const res = await fetch(`http://localhost:5000/api/files/getFile/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch image");
  }

  const data = await res.json();
  return data.fileUrl; // Adjust according to your response structure
}

export default async function UserPage({ params }) {
  const { id } = await params; // Get the ID from the URL parameters
  const imageUrl = await fetchImage(id); // Fetch the image URL

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid black",
      }}
    >
      <div className="w-1/2 h-1/2 border border-black ">
        {imageUrl ? (
          <Image src={imageUrl} alt="Image" width={300} height={300} />
        ) : (
          <p>Image not found</p>
        )}
      </div>
    </div>
  );
}
