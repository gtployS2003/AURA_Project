const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Function to reduce image size/quality and convert to Base64
async function convertImageToBase64(filePath) {
  try {
    // Resize the image and reduce quality
    const buffer = await sharp(filePath)
      .resize({ width: 100 }) // Resize to 100 pixels in width, keeping aspect ratio
      .jpeg({ quality: 50 }) // Convert to JPEG with 50% quality
      .toBuffer();

    // Convert to Base64
    const base64 = `data:image/jpg;base64,${buffer.toString("base64")}`;
    return base64;
  } catch (error) {
    console.error("Error processing image:", error);
    throw new Error("Image processing failed.");
  }
}

// Helper function to process images
const processImages = async (req) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    throw new Error("No files were uploaded.");
  }

  const uploadsDir = path.join(__dirname, "../../uploads");
  const imageUrls = [];

  for (const key of Object.keys(req.files)) {
    const fileExtension = req.files[key].mimetype.split("/")[1];
    const filePath = path.join(uploadsDir, `${key}.${fileExtension}`);

    try {
      // Check if the file exists
      if (fs.existsSync(filePath)) {
        const url = await convertImageToBase64(filePath);
        console.log(`Loaded and encoded image for ${key}`);
        imageUrls.push(url);

        // Optionally delete the file after processing
        fs.unlinkSync(filePath);
        console.log(`Deleted image file: ${filePath}`);
      } else {
        console.log(`No image found for ${key}`);
      }
    } catch (err) {
      console.error(`Error loading image for ${key}: ${err.message}`);
    }
  }

  return imageUrls;
};

module.exports = { processImages };
