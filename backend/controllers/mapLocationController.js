const VietnamLocation = require('../models/VietnamLocation');
const asyncHandler = require('../middleware/async');
const locations = require('../data/locations.js');

// @desc    Get all locations for map display
// @route   GET /api/map-locations
// @access  Public
exports.getMapLocations = asyncHandler(async (req, res, next) => {
  try {
    // Only fetch the fields needed for map display
    // const locations = await VietnamLocation.find({ isActive: true })
    //   .select('name shortDescription coordinates category region province thumbnailImage mapMarkerImage isPopular')
    //   .sort('-isPopular');

    // Send response
    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});