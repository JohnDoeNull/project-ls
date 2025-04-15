const express = require('express');
const router = express.Router();
const {
  getLocations,
  getLocation,
  createLocation,
  updateLocation,
  deleteLocation,
  incrementViewCount,
  getLocationsByRegion,
  getLocationsByCategory,
  getPopularLocations
} = require('../controllers/vietnamLocationController');

const { protect, authorize } = require('../middleware/auth');

// Special routes
router.route('/popular').get(getPopularLocations);
router.route('/regions/:region').get(getLocationsByRegion);
router.route('/categories/:category').get(getLocationsByCategory);

// Main routes
router
  .route('/')
  .get(getLocations)
  .post(protect, authorize('admin'), createLocation);

router
  .route('/:id')
  .get(getLocation)
  .put(protect, authorize('admin'), updateLocation)
  .delete(protect, authorize('admin'), deleteLocation);

// View count route
router.route('/:id/view').post(incrementViewCount);

module.exports = router;