const express = require('express');
const router = express.Router();
const authAdmin = require('../middleware/authAdmin');
const { getAllHalls, addHall, updateHall, deleteHall } = require('../controllers/hallController');

router.get('/', authAdmin, getAllHalls);
router.post('/', authAdmin, addHall);
router.put('/:id', authAdmin, updateHall);
router.delete('/:id', authAdmin, deleteHall);

module.exports = router;
