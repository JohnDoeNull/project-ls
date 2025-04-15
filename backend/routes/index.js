const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./api/auth');
// const userRoutes = require('./api/users');
// const regionRoutes = require('./api/regions');
// const culturalItemRoutes = require('./api/culturalItems');
// const quizRoutes = require('./api/quizzes');
// const virtualTourRoutes = require('./api/virtualTours');

// Mount routes
router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/regions', regionRoutes);
// router.use('/cultural-items', culturalItemRoutes);
// router.use('/quizzes', quizRoutes);
// router.use('/virtual-tours', virtualTourRoutes);

module.exports = router;