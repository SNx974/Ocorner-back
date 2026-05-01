const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  type: { type: String, enum: ['image', 'video', 'message'], default: 'image' },
  title: { type: String, default: '' },
  // image
  imageUrl: { type: String, default: '' },
  // video
  videoUrl: { type: String, default: '' },
  // message événement
  eventName:     { type: String, default: '' },
  eventTime:     { type: String, default: '' },
  eventLocation: { type: String, default: '' },
  eventImage:    { type: String, default: '' },
  eventColor:    { type: String, default: '#0fa3a3' },
  active: { type: Boolean, default: true },
  order:  { type: Number,  default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
