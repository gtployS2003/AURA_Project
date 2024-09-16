const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Function to reduce image size/quality and convert to Base64
async function convertImageToBase64(filePath) {
  try {
    // Reduce the size or quality here. Adjust the resize width, height, and quality as needed
    const buffer = await sharp(filePath)
      .resize({ width: 100 }) // Resize to 100 pixels in width, keeping aspect ratio
      .jpeg({ quality: 50 }) // Convert to JPEG with 50% quality
      .toBuffer();

    // Convert to Base64
    const base64 = `data:image/jpg;base64,${buffer.toString("base64")}`;
    return base64;
  } catch (error) {
    console.error("Error processing image:", error);
    throw new Error("Image processing failed");
  }
}

// Helper function to process images
const processImages = async (req) => {
  const imageUrls = [];

  for (const key of Object.keys(req.files)) {
    const filePath = req.files[key].path;  // ใช้ path ที่ถูกสร้างโดย multer หรือ middleware
    console.log(`Processing file at: ${filePath}`);

    try {
      // Check if the file exists
      if (fs.existsSync(filePath)) {
        const url = await convertImageToBase64(filePath);
        console.log(`Loaded and encoded image for ${key}`);
        imageUrls.push(url);
      } else {
        console.log(`No image found for ${key} at path: ${filePath}`);
      }
    } catch (err) {
      console.error(`Error processing image for ${key}: ${err.message}`);
    }
  }

  return imageUrls;
};

module.exports = { processImages };
