const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name:           { type: String, required: true, unique: true, trim: true },
  icon:           { type: String, default: '🍽️' },
  type:           { type: String, enum: ['FOOD', 'DRINK', 'OTHER'], default: 'FOOD' },
  order:          { type: Number, default: 0 },
  visible:        { type: Boolean, default: true },
  showOnTV:       { type: Boolean, default: true },   // affichage TV Menu
  showOnAnnonce:  { type: Boolean, default: false },  // affichage TV Annonce
  parent:         { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
