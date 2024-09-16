const path = require('path');
const fs = require('fs');

// Middleware to save uploaded images
function saveImages(req, res, next) {
    if (!req.files) {
        return res.status(400).json({ message: "No files uploaded" });
    }

    // Define upload directory
    const uploadDir = path.join(__dirname, '..', 'uploads');

    // Check if the upload directory exists and create it asynchronously if not
    fs.promises.mkdir(uploadDir, { recursive: true })
        .then(() => {
            // Save each file with a unique name
            const fileKeys = Object.keys(req.files);
            const savePromises = fileKeys.map((key) => {
                const file = req.files[key];  // Access each file by its key

                // Generate unique file name using current time and random number
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const fileExtension = path.extname(file.name);  // Get the file extension
                const newFileName = `${key}${fileExtension}`;
                const savePath = path.join(uploadDir, newFileName);

                // Use mv() to move the file to the upload directory
                return new Promise((resolve, reject) => {
                    file.mv(savePath, (err) => {
                        if (err) {
                            return reject(err);
                        }
                        console.log(`File saved to: ${savePath}`);
                        // Set the file path so it can be accessed later
                        req.files[key].path = savePath;  // Save the path back to the correct file key
                        resolve();
                    });
                });
            });

            // Wait for all files to be saved
            return Promise.all(savePromises);
        })
        .then(() => {
            next();  // Proceed to the next middleware after all files are saved
        })
        .catch((error) => {
            console.error("Error saving files:", error);
            res.status(500).json({ message: "Failed to save files", error });
        });
}

module.exports = { saveImages };
