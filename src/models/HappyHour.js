const mongoose = require('mongoose');

const HappyHourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startHour: { type: Number, required: true, min: 0, max: 23 },
  startMinute: { type: Number, default: 0, min: 0, max: 59 },
  endHour: { type: Number, required: true, min: 0, max: 23 },
  endMinute: { type: Number, default: 0, min: 0, max: 59 },
  active: { type: Boolean, default: true },
  days: [{ type: Number, min: 0, max: 6 }], // 0=Sun, 1=Mon...
  discounts: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    happyPrice: { type: Number, required: true },
  }],
}, { timestamps: true });

module.exports = mongoose.model('HappyHour', HappyHourSchema);
