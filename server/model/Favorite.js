const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  outfit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Outfit',  // เชื่อมโยงกับโมเดล Outfit
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
});

// เพิ่มการเชื่อมโยงแบบ populate โดย default (optional)
FavoriteSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'outfit',
    select: '-__v'  // เลือกเฉพาะฟิลด์ที่ต้องการ
  });
  next();
});

const Favorite = mongoose.model('Favorite', FavoriteSchema);
module.exports = Favorite;
