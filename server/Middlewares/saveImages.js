const path = require('path');
const fs = require('fs');

// Middleware to save uploaded images
function saveImages(req, res, next) {
    if (!req.files) {
        return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadDir = path.join(__dirname, '..', 'uploads');

    fs.promises.mkdir(uploadDir, { recursive: true })
        .then(() => {
            const fileKeys = Object.keys(req.files);
            const savePromises = fileKeys.map((key) => {
                const file = req.files[key];
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const fileExtension = path.extname(file.name);
                const newFileName = `${key}${fileExtension}`;
                const savePath = path.join(uploadDir, newFileName);

                return new Promise((resolve, reject) => {
                    file.mv(savePath, (err) => {
                        if (err) {
                            return reject(err);
                        }
                        req.files[key].path = savePath;
                        resolve();
                    });
                });
            });

            return Promise.all(savePromises);
        })
        .then(() => {
            next();
        })
        .catch((error) => {
            console.error("Error saving files:", error);
            res.status(500).json({ message: "Failed to save files", error });
        });
}

module.exports = { saveImages };