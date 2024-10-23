// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const fileRoutes = require("./routes/fileRoutes");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Next.js client URL
    methods: ["GET", "POST"], // Allow POST for file uploads
  })
);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Middleware
app.use(express.json());

// Routes
app.use("/api/files", fileRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
