const express = require("express");
const router = express.Router();
const { analyzer } = require('../controllers/analyzer');
const { getAllSavedOutfits, saveFavorite, getFavorites } = require("../controllers/outfitsController");

// เรียกใช้ฟังก์ชัน analyzer เพื่อสร้าง Outfit Inspirations จาก GPT
router.post("/generate-outfits", analyzer);

// ดึงข้อมูล outfits ทั้งหมด
router.get("/outfits", getAllSavedOutfits);

// บันทึก favorites
router.post("/save-favorite", saveFavorite);

// ดึงข้อมูล favorites ทั้งหมด
router.get("/favorites", getFavorites);

module.exports = router;
