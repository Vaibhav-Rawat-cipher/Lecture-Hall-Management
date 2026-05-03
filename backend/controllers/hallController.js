const Hall = require('../models/Hall');

// ─── Get all halls ────────────────────────────────────────────────────────────
const getAllHalls = async (req, res) => {
  try {
    const halls = await Hall.find().sort({ hallCode: 1 });
    res.json(halls);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── Add a hall ───────────────────────────────────────────────────────────────
const addHall = async (req, res) => {
  try {
    const { hallCode, name, capacity, location, facilities } = req.body;
    if (!hallCode || !name || !capacity) {
      return res.status(400).json({ message: 'hallCode, name, and capacity are required' });
    }
    const hall = await Hall.create({ hallCode, name, capacity, location, facilities });
    res.status(201).json({ message: 'Hall added', hall });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Hall code already exists' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── Update hall details ──────────────────────────────────────────────────────
const updateHall = async (req, res) => {
  try {
    const allowed = ['name', 'capacity', 'location', 'facilities', 'isAvailable'];
    const updates = {};
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const hall = await Hall.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!hall) return res.status(404).json({ message: 'Hall not found' });
    res.json({ message: 'Hall updated', hall });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── Delete a hall ────────────────────────────────────────────────────────────
const deleteHall = async (req, res) => {
  try {
    const hall = await Hall.findByIdAndDelete(req.params.id);
    if (!hall) return res.status(404).json({ message: 'Hall not found' });
    res.json({ message: 'Hall deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getAllHalls, addHall, updateHall, deleteHall };
