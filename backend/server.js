require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const bookingRoutes = require('./routes/bookingRoutes');
const hallRoutes = require('./routes/hallRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/halls', hallRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Group 19 - Booking Confirmation API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Connect DB then start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
