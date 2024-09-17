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

// บันทึก Outfit เป็น Favorites
const saveFavorite = async (req, res) => {
  try {
    const { outfitId } = req.body;
    
    console.log("Request to save favorite received for outfitId:", outfitId); // ตรวจสอบว่า server ได้รับ request แล้ว

    // ตรวจสอบว่า outfitId มีอยู่หรือไม่
    const outfit = await Outfit.findById(outfitId);
    if (!outfit) {
      return res.status(404).json({ message: 'Outfit not found' });
    }

    // ตรวจสอบว่า outfit ถูกบันทึกเป็น favorite แล้วหรือยัง
    if (outfit.favorite) {
      return res.status(400).json({ message: 'Outfit is already a favorite' });
    }

    // บันทึก outfit เป็น favorite
    outfit.favorite = true;
    await outfit.save();

    // เพิ่มเอกสารใหม่ใน Favorite collection
    const favorite = new Favorite({ outfit: outfitId });
    await favorite.save();

    console.log("Outfit saved as favorite successfully"); // ตรวจสอบว่าบันทึกสำเร็จ
    res.status(201).json({ message: 'บันทึก outfit เป็น favorite แล้ว!' });
  } catch (error) {
    console.error("Error saving outfit as favorite:", error); // ตรวจสอบ error
    res.status(500).json({ message: 'Error saving outfit as favorite' });
  }
};

// ดึงข้อมูล Favorites ที่บันทึกไว้ทั้งหมด
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find().populate('outfit'); // ดึงข้อมูล outfit ที่เชื่อมโยง
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

module.exports = { getRecommendations, saveFavorite, getFavorites, getAllSavedOutfits };
