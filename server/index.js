const express = require("express");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const clothesRoutes = require("./routes/clothes");
const outfitsRoutes = require("./routes/outfits");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; 

// Middleware
app.use(cors());
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
}));
app.use(express.json()); // Parse JSON bodies


// Serve static files in the public folder
app.use("/public", express.static(path.join(__dirname, "../client/public")));

// Routes
app.use("/api/clothes", clothesRoutes);
app.use("/api/outfits", outfitsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
