const VietnamLocation = require('../models/VietnamLocation');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all Vietnam locations
// @route   GET /api/vietnam-locations
// @access  Public
exports.getLocations = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit', 'search'];

  // Remove fields from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Convert query to string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = VietnamLocation.find(JSON.parse(queryStr));

  // Handle search
  if (req.query.search) {
    const regex = new RegExp(req.query.search, 'i');
    query = query.or([
      { name: regex },
      { description: regex },
      { shortDescription: regex },
      { tags: regex }
    ]);
  }

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await VietnamLocation.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const locations = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: locations.length,
    pagination,
    data: locations
  });
});

// @desc    Get single Vietnam location
// @route   GET /api/vietnam-locations/:id
// @access  Public
exports.getLocation = asyncHandler(async (req, res, next) => {
  const location = await VietnamLocation.findById(req.params.id);

  if (!location) {
    return next(
      new ErrorResponse(`Location not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: location
  });
});

// @desc    Create new Vietnam location
// @route   POST /api/vietnam-locations
// @access  Private (Admin)
exports.createLocation = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for existing location with same name
  const existingLocation = await VietnamLocation.findOne({ name: req.body.name });

  if (existingLocation) {
    return next(
      new ErrorResponse(`Location with name ${req.body.name} already exists`, 400)
    );
  }

  const location = await VietnamLocation.create(req.body);

  res.status(201).json({
    success: true,
    data: location
  });
});

// @desc    Update Vietnam location
// @route   PUT /api/vietnam-locations/:id
// @access  Private (Admin)
exports.updateLocation = asyncHandler(async (req, res, next) => {
  let location = await VietnamLocation.findById(req.params.id);

  if (!location) {
    return next(
      new ErrorResponse(`Location not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is admin
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to update this location`, 401)
    );
  }

  location = await VietnamLocation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: location
  });
});

// @desc    Delete Vietnam location
// @route   DELETE /api/vietnam-locations/:id
// @access  Private (Admin)
exports.deleteLocation = asyncHandler(async (req, res, next) => {
  const location = await VietnamLocation.findById(req.params.id);

  if (!location) {
    return next(
      new ErrorResponse(`Location not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is admin
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to delete this location`, 401)
    );
  }

  await location.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Increment view count for a location
// @route   POST /api/vietnam-locations/:id/view
// @access  Public
exports.incrementViewCount = asyncHandler(async (req, res, next) => {
  const location = await VietnamLocation.findByIdAndUpdate(
    req.params.id,
    { $inc: { viewCount: 1 } },
    { new: true }
  );

  if (!location) {
    return next(
      new ErrorResponse(`Location not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: { viewCount: location.viewCount }
  });
});

// @desc    Get locations by region
// @route   GET /api/vietnam-locations/regions/:region
// @access  Public
exports.getLocationsByRegion = asyncHandler(async (req, res, next) => {
  const locations = await VietnamLocation.find({ region: req.params.region });

  res.status(200).json({
    success: true,
    count: locations.length,
    data: locations
  });
});

// @desc    Get locations by category
// @route   GET /api/vietnam-locations/categories/:category
// @access  Public
exports.getLocationsByCategory = asyncHandler(async (req, res, next) => {
  const locations = await VietnamLocation.find({ category: req.params.category });

  res.status(200).json({
    success: true,
    count: locations.length,
    data: locations
  });
});

// @desc    Get popular locations
// @route   GET /api/vietnam-locations/popular
// @access  Public
exports.getPopularLocations = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 5;
  const locations = await VietnamLocation.find({ isPopular: true })
    .sort('-viewCount')
    .limit(limit);

  res.status(200).json({
    success: true,
    count: locations.length,
    data: locations
  });
});