const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// สร้าง endpoint สำหรับดึงรายการรูปภาพจากโฟลเดอร์ uploads
router.get('/list', (req, res) => {
  const directoryPath = path.join(__dirname, '../uploads'); // ชี้ไปที่โฟลเดอร์ uploads
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan directory');
    }
    // กรองเฉพาะไฟล์รูปภาพที่มีนามสกุลเป็น jpg, jpeg, png, gif
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    // สร้าง URL สำหรับแต่ละรูปภาพ
    const imageUrls = imageFiles.map(file => `http://localhost:3500/uploads/${file}`);
    res.json({ images: imageUrls }); // ส่ง URL ของรูปภาพกลับไปยัง client
  });
});

module.exports = router;
