const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  outfit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Outfit'  // เชื่อมโยงกับโมเดล Outfit
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
});

const Favorite = mongoose.model('Favorite', FavoriteSchema);
module.exports = Favorite;
