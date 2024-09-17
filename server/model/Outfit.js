const mongoose = require('mongoose');

const OutfitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // อ้างอิงถึงผู้ใช้ที่บันทึก outfit นี้
  description: String,
  score: Number,
  clothes: [String], // เก็บลิสต์ของ URL รูปภาพหรือ base64
  style: String,     // สไตล์ที่เกี่ยวข้อง เช่น Preppy หรือ NYC
  favorite: { type: Boolean, default: false }, // ฟิลด์ที่ใช้บันทึกว่าชุดนี้เป็น favorite หรือไม่
  createdAt: { type: Date, default: Date.now }, // เวลาในการสร้าง
});

const Outfit = mongoose.model('Outfit', OutfitSchema);
module.exports = Outfit;
