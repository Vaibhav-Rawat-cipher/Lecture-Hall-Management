const mongoose = require('mongoose');

const hallSchema = new mongoose.Schema(
  {
    hallCode: {
      type: String,
      required: [true, 'Hall code is required'],
      unique: true,
      trim: true,
      uppercase: true,
      // e.g. "LH-101", "LH-201"
    },
    name: {
      type: String,
      required: [true, 'Hall name is required'],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: 1,
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    facilities: {
      type: [String],
      default: [],
      // e.g. ["Projector", "AC", "Whiteboard", "Mic"]
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hall', hallSchema);
