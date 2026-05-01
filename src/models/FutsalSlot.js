const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  terrain: { type: Number, required: true, min: 1 },
  name: { type: String, required: true, trim: true },
}, { _id: false });

const FutsalSlotSchema = new mongoose.Schema({
  hour: { type: Number, required: true, min: 0, max: 23 },
  date: { type: String, required: true }, // YYYY-MM-DD
  reservations: [ReservationSchema],
  active: { type: Boolean, default: true },
}, { timestamps: true });

FutsalSlotSchema.index({ date: 1, hour: 1 }, { unique: true });

module.exports = mongoose.model('FutsalSlot', FutsalSlotSchema);
