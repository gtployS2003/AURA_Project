const express = require("express");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const clothesRoutes = require("./routes/clothes");
const outfitsRoutes = require("./routes/outfits");
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI,)
  .then(() => {
    console.log("MongoDB connected");

    // Start server after successful connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Middleware
app.use(cors());
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  abortOnLimit: true, // Abort upload if file size exceeds the limit
  responseOnLimit: 'File size is too large. Limit is 5MB.' // Custom response message on file size limit
}));
app.use(express.json()); // Parse JSON bodies

// Serve static files in the public folder
app.use("/public", express.static(path.join(__dirname, "../client/public")));

// Routes
app.use("/api/clothes", clothesRoutes);
app.use("/api/outfits", outfitsRoutes);

// 404 Error handling for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Resource not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
