const jwt = require('jsonwebtoken');
const config = require('../config/default');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

module.exports = async function(req, res, next) {
  let token;

  // Check for token in cookies first (preferred method)
  if (req.cookies.token) {
    token = req.cookies.token;
  } 
  // Also check Authorization header as fallback (for API clients)
  else if (
    req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if no token
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Add user from payload
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorResponse('User not found', 404));
    }

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};