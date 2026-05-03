const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    hallId: {
      type: String,
      required: [true, 'Hall ID is required'],
      // Change to: type: mongoose.Schema.Types.ObjectId, ref: 'Hall'
      // once Group 18 confirms their Hall schema
    },
    hallName: {
      type: String,
      required: [true, 'Hall name is required'],
    },
    eventName: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
    },
    bookedBy: {
      type: String,
      required: [true, 'Booked by (admin name) is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    startTime: {
      type: String, // "HH:MM" format
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String, // "HH:MM" format
      required: [true, 'End time is required'],
    },
    purpose: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
