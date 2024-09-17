const mongoose = require('mongoose');

const OutfitSchema = new mongoose.Schema({
  outfit_id: { 
    type: Number, 
    required: true 
  }, // ตัวระบุชุดที่สร้างโดย GPT
  description: String,
  considerations: String, // อธิบายเหตุผลในการเลือกชุด
  score: Number,
  clothes: [String], // เก็บลิสต์ของ URL รูปภาพหรือ base64
  style: String,     // สไตล์ที่เกี่ยวข้อง เช่น Preppy หรือ NYC
  favorite: { 
    type: Boolean, 
    default: false 
  }, // ฟิลด์ที่ใช้บันทึกว่าชุดนี้เป็น favorite หรือไม่
  createdAt: { 
    type: Date, 
    default: Date.now 
  }, // เวลาในการสร้าง
});

const Outfit = mongoose.model('Outfit', OutfitSchema);
module.exports = Outfit;
