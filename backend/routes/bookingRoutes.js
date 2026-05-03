const express = require('express');
const router = express.Router();
const authAdmin = require('../middleware/authAdmin');
const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
} = require('../controllers/bookingController');

router.post('/', authAdmin, createBooking);
router.get('/', authAdmin, getAllBookings);
router.get('/:id', authAdmin, getBookingById);
router.put('/:id', authAdmin, updateBooking);
router.delete('/:id', authAdmin, cancelBooking);

module.exports = router;
