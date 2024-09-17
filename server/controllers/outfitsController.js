const Outfit = require('../models/Outfit');
const Favorite = require('../models/Favorite');

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
    const favorite = new Favorite({ outfit: outfitId });
    await favorite.save(); // บันทึกลง MongoDB
    res.status(201).json({ message: 'บันทึก outfit เป็น favorite แล้ว!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving favorite' });
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

module.exports = { getRecommendations, saveFavorite, getFavorites };
