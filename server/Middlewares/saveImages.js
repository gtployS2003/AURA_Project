const fs = require("fs");
const path = require("path");

const saveImages = async (req, res, next) => {
  const messages = [];
  const uploadsDir = path.join(__dirname, "../uploads");

  // Check if the uploads directory exists, if not create it
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const errorOccurred = await Promise.all(
    Object.keys(req.files).map(async (key) => {
      const file = req.files[key];
      const filePath = path.join(
        uploadsDir,
        `${key}.${file.mimetype.split("/")[1]}`
      ); // Save with the correct extension

      try {
        console.log(`Attempting to save file to: ${filePath}`);
        // Write the file asynchronously
        await fs.promises.writeFile(filePath, file.data);
        messages.push(`${key} saved as an image file.`);
        return false; // No error, continue processing
      } catch (err) {
        messages.push(`Error saving ${key}: ${err.message}`);
        return true; // Error occurred, stop processing
      }
    })
  );

  // Check if any error occurred during the file saving process
  if (errorOccurred.some((error) => error)) {
    return res.status(500).json({ message: messages.join("\n") });
  }

  next(); // If no errors, proceed to the next middleware
};

module.exports = { saveImages };
