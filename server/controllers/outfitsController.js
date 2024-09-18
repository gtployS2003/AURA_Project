const mongoose = require('mongoose');
const Outfit = require('../model/Outfit.js');
const Favorite = require('../model/Favorite.js');

// ดึงข้อมูล Outfit Recommendations
const getRecommendations = async (req, res) => {
  try {
    const recommendations = await Outfit.find(); // ดึงข้อมูล outfits ทั้งหมด
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
};

const saveFavorite = async (req, res) => {
  try {
    const { outfitId } = req.body;
    
    console.log("Request to save favorite received for outfitId:", outfitId);

    // ตรวจสอบว่า outfitId มีความยาว 24 ตัวอักษรและเป็น string (รูปแบบ ObjectId)
    if (!mongoose.Types.ObjectId.isValid(outfitId)) {
      console.error("Invalid outfit ID format:", outfitId);
      return res.status(400).json({ message: "Invalid outfit ID format" });
    }

    // แปลง outfitId เป็น ObjectId
    const objectId = new mongoose.Types.ObjectId(outfitId);

    // ตรวจสอบว่า outfitId มีอยู่ในฐานข้อมูลหรือไม่
    const outfit = await Outfit.findById(objectId);
    if (!outfit) {
      console.error("Outfit not found with ID:", objectId);
      return res.status(404).json({ message: 'Outfit not found' });
    }

    // ตรวจสอบว่าชุดนี้ถูกบันทึกเป็น favorite แล้วหรือไม่
    const existingFavorite = await Favorite.findOne({ outfit: objectId });
    if (existingFavorite) {
      return res.status(400).json({ message: 'Outfit is already a favorite' });
    }

    // บันทึกชุดเป็น favorite
    const favorite = new Favorite({ outfit: objectId });
    await favorite.save();

    console.log("Outfit saved as favorite successfully");
    res.status(201).json({ message: 'Outfit saved as favorite!' });
  } catch (error) {
    console.error("Error saving outfit as favorite:", error);
    res.status(500).json({ message: 'Error saving outfit as favorite' });
  }
};

// ฟังก์ชันสำหรับดึง Favorites ทั้งหมด
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find(); // ดึงข้อมูล favorites outfits ทั้งหมด
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorites' });
  }
};

// ดึงข้อมูล All Saved Outfits (รวมทั้ง Favorites และ Non-Favorites)
const getAllSavedOutfits = async (req, res) => {
  try {
    const outfits = await Outfit.find(); // ดึงข้อมูลทั้งหมด ไม่ว่าชุดนั้นจะเป็น favorite หรือไม่
    if (!outfits || outfits.length === 0) {
      return res.status(404).json({ message: "No outfits found" });
    }
    
    console.log("Sending all saved outfits:", outfits); // ตรวจสอบข้อมูล outfits ก่อนส่งกลับไป
    res.status(200).json(outfits); // ส่ง outfits กลับไปยัง client
  } catch (error) {
    console.error("Error fetching all saved outfits:", error);
    res.status(500).json({ message: "Error fetching all saved outfits" });
  }
};

const removeOutfit = async (req, res) => {
  try {
    const { outfitId } = req.body; // ดึงค่า outfitId จาก body request
    const removedOutfit = await Favorite.findOneAndDelete({ outfit: outfitId });
    if (!removedOutfit) {
      return res.status(404).json({ message: 'Outfit not found' });
    }
    res.status(200).json({ message: 'Outfit removed successfully' });
  } catch (error) {
    console.error("Error removing outfit:", error);
    res.status(500).json({ message: 'Error removing outfit' });
  }
};

module.exports = { getRecommendations, saveFavorite, getFavorites, getAllSavedOutfits, removeOutfit };
