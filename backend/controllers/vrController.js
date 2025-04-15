// controllers/vietnamVRController.js
const VietnamLocation = require('../models/VietnamLocation');
const UserProgress = require('../models/UserProgress');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all Vietnam VR locations
// @route   GET /api/vietnam-vr
// @access  Public
exports.getVietnamLocations = asyncHandler(async (req, res, next) => {
  const { region, category, search } = req.query;
  const filter = {};

  // Apply filters if provided
  if (region) filter.region = region;
  if (category) filter.category = category;
  
  // Search functionality
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { province: { $regex: search, $options: 'i' } }
    ];
  }

  // Only return active locations
  filter.isActive = true;

  // Get all locations with basic info for map display
  const locations = await VietnamLocation.find(filter)
    .select('name shortDescription coordinates region province category thumbnailImage mapMarkerImage isPopular');

  res.status(200).json({
    success: true,
    count: locations.length,
    data: locations
  });
});

// @desc    Get single Vietnam VR location
// @route   GET /api/vietnam-vr/:id
// @access  Public
exports.getVietnamLocation = asyncHandler(async (req, res, next) => {
  const location = await VietnamLocation.findById(req.params.id);

  if (!location) {
    return next(new ErrorResponse(`Location not found with id of ${req.params.id}`, 404));
  }

  // If user is authenticated, check their progress for this location
  let userVRProgress = null;
  if (req.user) {
    const userProgress = await UserProgress.findOne({ user: req.user.id });
    if (userProgress) {
      userVRProgress = userProgress.vrExperiences.find(
        exp => exp.location.toString() === req.params.id
      );
    }
  }

  res.status(200).json({
    success: true,
    data: {
      ...location.toObject(),
      userProgress: userVRProgress ? {
        hotspotsViewed: userVRProgress.hotspotsViewed,
        completionPercentage: userVRProgress.completionPercentage,
        lastVisited: userVRProgress.startTime
      } : null
    }
  });
});

// @desc    Start a Vietnam VR experience (record start time)
// @route   POST /api/vietnam-vr/:id/start
// @access  Private
exports.startVietnamVR = asyncHandler(async (req, res, next) => {
  const location = await VietnamLocation.findById(req.params.id);

  if (!location) {
    return next(new ErrorResponse(`Location not found with id of ${req.params.id}`, 404));
  }

  // Get or create user progress record
  let userProgress = await UserProgress.findOne({ user: req.user.id });
  
  if (!userProgress) {
    userProgress = await UserProgress.create({ user: req.user.id });
  }

  // Check if user already started this VR experience
  const existingExperience = userProgress.vrExperiences.find(
    exp => exp.location.toString() === req.params.id
  );

  // Current timestamp
  const startTime = new Date();

  if (existingExperience) {
    // Update existing experience
    existingExperience.startTime = startTime;
    // Don't reset completion percentage or hotspots if they've already viewed some
    if (!existingExperience.completionPercentage) {
      existingExperience.completionPercentage = 0;
    }
    if (!existingExperience.hotspotsViewed) {
      existingExperience.hotspotsViewed = [];
    }
    existingExperience.lastPosition = { x: 0, y: 0, z: 0 };
  } else {
    // Add new experience
    userProgress.vrExperiences.push({
      location: req.params.id,
      startTime,
      completionPercentage: 0,
      hotspotsViewed: [],
      lastPosition: { x: 0, y: 0, z: 0 }
    });
  }

  // Update last active time
  userProgress.lastActive = startTime;

  await userProgress.save();

  // Increment view counter
  await VietnamLocation.findByIdAndUpdate(req.params.id, {
    $inc: { viewCount: 1 }
  });

  // Prepare response with VR content
  const vrResponse = {
    locationId: location._id,
    name: location.name,
    region: location.region,
    startTime,
    vrContent: location.vrContent,
    hotspots: location.hotspots,
    audioGuide: location.audioGuide
  };

  res.status(200).json({
    success: true,
    message: 'Vietnam VR experience started',
    data: vrResponse
  });
});

// @desc    Update Vietnam VR experience progress
// @route   PUT /api/vietnam-vr/:id/progress
// @access  Private
exports.updateVietnamVRProgress = asyncHandler(async (req, res, next) => {
  const { completionPercentage, hotspotsViewed, position, timeSpent } = req.body;

  // Find user progress
  const userProgress = await UserProgress.findOne({ user: req.user.id });
  
  if (!userProgress) {
    return next(new ErrorResponse('User progress not found', 404));
  }

  // Find the specific VR experience
  const experienceIndex = userProgress.vrExperiences.findIndex(
    exp => exp.location.toString() === req.params.id
  );

  if (experienceIndex === -1) {
    return next(new ErrorResponse('VR experience not started for this location', 404));
  }

  // Update fields if provided
  if (completionPercentage !== undefined) {
    userProgress.vrExperiences[experienceIndex].completionPercentage = completionPercentage;
  }

  if (hotspotsViewed && hotspotsViewed.length > 0) {
    // Initialize if doesn't exist
    if (!userProgress.vrExperiences[experienceIndex].hotspotsViewed) {
      userProgress.vrExperiences[experienceIndex].hotspotsViewed = [];
    }
    
    // Add only unique hotspots
    const currentHotspots = userProgress.vrExperiences[experienceIndex].hotspotsViewed;
    hotspotsViewed.forEach(hotspot => {
      if (!currentHotspots.includes(hotspot)) {
        currentHotspots.push(hotspot);
      }
    });
  }

  if (position) {
    userProgress.vrExperiences[experienceIndex].lastPosition = position;
  }
  
  if (timeSpent) {
    userProgress.vrExperiences[experienceIndex].timeSpent = 
      (userProgress.vrExperiences[experienceIndex].timeSpent || 0) + timeSpent;
  }

  // Update last active time
  userProgress.lastActive = new Date();

  await userProgress.save();

  res.status(200).json({
    success: true,
    message: 'Vietnam VR experience progress updated',
    data: {
      completionPercentage: userProgress.vrExperiences[experienceIndex].completionPercentage,
      hotspotsViewed: userProgress.vrExperiences[experienceIndex].hotspotsViewed,
      timeSpent: userProgress.vrExperiences[experienceIndex].timeSpent
    }
  });
});

// @desc    Complete Vietnam VR experience
// @route   PUT /api/vietnam-vr/:id/complete
// @access  Private
exports.completeVietnamVR = asyncHandler(async (req, res, next) => {
  // Find user progress
  const userProgress = await UserProgress.findOne({ user: req.user.id });
  
  if (!userProgress) {
    return next(new ErrorResponse('User progress not found', 404));
  }

  // Find the specific VR experience
  const experienceIndex = userProgress.vrExperiences.findIndex(
    exp => exp.location.toString() === req.params.id
  );

  if (experienceIndex === -1) {
    return next(new ErrorResponse('VR experience not started for this location', 404));
  }

  // Mark as complete
  const endTime = new Date();
  userProgress.vrExperiences[experienceIndex].endTime = endTime;
  userProgress.vrExperiences[experienceIndex].completionPercentage = 100;
  
  // Calculate points based on hotspots viewed
  const location = await VietnamLocation.findById(req.params.id);
  const totalHotspots = location.hotspots.length;
  const viewedHotspots = userProgress.vrExperiences[experienceIndex].hotspotsViewed.length;
  
  // Base points + bonus for hotspots
  const basePoints = 50;
  const hotspotBonus = totalHotspots > 0 ? Math.floor((viewedHotspots / totalHotspots) * 50) : 0;
  const pointsEarned = basePoints + hotspotBonus;
  
  userProgress.learningPath.totalPoints += pointsEarned;

  // Update Vietnam region progress specifically
  const regionIndex = userProgress.learningPath.regions.findIndex(
    r => r.name === 'Vietnam' || r.name === location.region
  );

  if (regionIndex !== -1) {
    // Update existing region progress
    userProgress.learningPath.regions[regionIndex].progressPercentage += 5;
    // Cap at 100%
    if (userProgress.learningPath.regions[regionIndex].progressPercentage > 100) {
      userProgress.learningPath.regions[regionIndex].progressPercentage = 100;
    }
  } else {
    // Add new region
    userProgress.learningPath.regions.push({
      name: 'Vietnam',
      progressPercentage: 5
    });
  }

  // Update user's explored regions count for achievements
  if (!userProgress.metadata) {
    userProgress.metadata = {};
  }
  
  if (!userProgress.metadata.exploredVietnamRegions) {
    userProgress.metadata.exploredVietnamRegions = [];
  }
  
  if (!userProgress.metadata.exploredVietnamRegions.includes(location.region)) {
    userProgress.metadata.exploredVietnamRegions.push(location.region);
    
    // Check for Vietnam Explorer achievement
    if (userProgress.metadata.exploredVietnamRegions.length >= 3) {
      // Add Vietnam Explorer achievement if not already earned
      const hasAchievement = userProgress.learningPath.achievements.some(
        a => a.name === 'Vietnam Explorer'
      );
      
      if (!hasAchievement) {
        userProgress.learningPath.achievements.push({
          name: 'Vietnam Explorer',
          earnedDate: new Date(),
          description: 'Explored VR experiences in 3 different regions of Vietnam',
          iconUrl: '/images/achievements/vietnam_explorer.png'
        });
        
        // Bonus points for achievement
        userProgress.learningPath.totalPoints += 100;
      }
    }
  }

  // Update last active time
  userProgress.lastActive = endTime;

  await userProgress.save();

  // Calculate session duration
  const sessionDuration = userProgress.vrExperiences[experienceIndex].timeSpent || 
    (endTime - userProgress.vrExperiences[experienceIndex].startTime) / 1000; // in seconds

  res.status(200).json({
    success: true,
    message: 'Vietnam VR experience completed',
    data: {
      pointsEarned,
      totalPoints: userProgress.learningPath.totalPoints,
      completionTime: endTime,
      duration: sessionDuration,
      hotspotsViewed: viewedHotspots,
      totalHotspots: totalHotspots,
      newAchievements: userProgress.learningPath.achievements
        .filter(a => a.earnedDate > userProgress.vrExperiences[experienceIndex].startTime)
        .map(a => a.name)
    }
  });
});

// @desc    Get nearby locations
// @route   GET /api/vietnam-vr/:id/nearby
// @access  Public
exports.getNearbyLocations = asyncHandler(async (req, res, next) => {
  const location = await VietnamLocation.findById(req.params.id);

  if (!location) {
    return next(new ErrorResponse(`Location not found with id of ${req.params.id}`, 404));
  }

  // Find locations in the same region or neighboring provinces
  const nearbyLocations = await VietnamLocation.find({
    _id: { $ne: req.params.id }, // Exclude current location
    $or: [
      { region: location.region },
      { province: location.province }
    ],
    isActive: true
  })
  .limit(5)
  .select('name shortDescription coordinates region province category thumbnailImage');

  res.status(200).json({
    success: true,
    count: nearbyLocations.length,
    data: nearbyLocations
  });
});