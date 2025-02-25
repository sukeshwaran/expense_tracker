const express = require('express');
const router = express.Router();
const { addContact } = require('../controllers/contactController');

router.post('/contacts', addContact); // ✅ Ensure this route exists

module.exports = router;
