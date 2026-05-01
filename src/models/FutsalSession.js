const mongoose = require('mongoose');

const FutsalSessionSchema = new mongoose.Schema({
  terrain: { type: Number, required: true },
  responsible: { type: String, required: true, trim: true },
  players: [{
    name: { type: String, required: true, trim: true },
    paid: { type: Boolean, default: false },
  }],
  totalPrice: { type: Number, default: 110 },
  closed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('FutsalSession', FutsalSessionSchema);
