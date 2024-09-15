const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function convertImageToBase64(filePath) {
  try {
    console.log(`Processing image at path: ${filePath}`);
    
    const buffer = await sharp(filePath)
      .resize({ width: 100 }) 
      .jpeg({ quality: 50 }) 
      .toBuffer();

    const base64 = `data:image/jpg;base64,${buffer.toString("base64")}`;
    return base64;
  } catch (error) {
    console.error("Error processing image:", error.message);
    throw new Error("Image processing failed.");
  }
}

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
      console.log(`Checking if file exists for ${key} at path: ${filePath}`);

      if (fs.existsSync(filePath)) {
        const url = await convertImageToBase64(filePath);
        console.log(`Loaded and encoded image for ${key}`);
        imageUrls.push(url);

        // Delete the file after processing
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
