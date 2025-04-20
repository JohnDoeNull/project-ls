const express = require('express');
const router = express.Router();
const { getMapLocations } = require('../../controllers/mapLocationController');

// Get all locations for map display
router.route('/').get(getMapLocations);

module.exports = router;