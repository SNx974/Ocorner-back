const mongoose = require('mongoose');

const BirthdaySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, default: '' },
  active: { type: Boolean, default: true },
  date: { type: String, default: '' }, // format YYYY-MM-DD, vide = aujourd'hui toujours affiché
  slot: { type: Number, default: null }, // null = auto, 0-5 = créneau fixe
}, { timestamps: true });

module.exports = mongoose.model('Birthday', BirthdaySchema);
