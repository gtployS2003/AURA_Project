const express = require("express");
const router = express.Router();
const { analyzer } = require('../controllers/analyzer');
const outfitsController = require('../controllers/outfitsController');

// เรียกใช้ฟังก์ชัน analyzer เพื่อสร้าง Outfit Inspirations จาก GPT
router.post("/generate-outfits", analyzer);

// ดึงข้อมูล outfits ทั้งหมด
router.get("/outfits", outfitsController.getAllSavedOutfits);

// ดึงข้อมูล favorites ทั้งหมด
router.get("/favorites", outfitsController.getFavorites);

// บันทึก favorites
router.post("/save-favorite", outfitsController.saveFavorite);

router.delete("/remove", outfitsController.removeOutfit);

module.exports = router;
