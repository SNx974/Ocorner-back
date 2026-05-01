const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  tags: [{ type: String }],
  visible: { type: Boolean, default: true },
  image: { type: String, default: '' },
  allergens: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
