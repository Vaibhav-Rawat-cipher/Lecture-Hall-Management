const Booking = require('../models/Booking');
const Hall = require('../models/Hall');

// ─── Create a booking (Allocate hall for event) ───────────────────────────────
const createBooking = async (req, res) => {
  try {
    const { hallId, hallName, eventName, bookedBy, date, startTime, endTime, purpose } = req.body;

    // Basic field check
    if (!hallId || !hallName || !eventName || !bookedBy || !date || !startTime || !endTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Mark hall as unavailable
    await Hall.findByIdAndUpdate(hallId, { isAvailable: false }).catch(() => {
      // If hallId is not a valid ObjectId yet (string mode), skip silently
    });

    const booking = await Booking.create({
      hallId,
      hallName,
      eventName,
      bookedBy,
      date,
      startTime,
      endTime,
      purpose: purpose || '',
    });

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── Get all bookings ─────────────────────────────────────────────────────────
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── Get single booking ───────────────────────────────────────────────────────
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── Update a booking ─────────────────────────────────────────────────────────
const updateBooking = async (req, res) => {
  try {
    const allowedFields = ['hallId', 'hallName', 'eventName', 'bookedBy', 'date', 'startTime', 'endTime', 'purpose'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const booking = await Booking.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking updated', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── Cancel a booking (soft delete — status: 'cancelled') ────────────────────
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Mark hall available again
    await Hall.findByIdAndUpdate(booking.hallId, { isAvailable: true }).catch(() => {});

    res.json({ message: 'Booking cancelled', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createBooking, getAllBookings, getBookingById, updateBooking, cancelBooking };
