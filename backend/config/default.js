module.exports = {
    // Application defaults
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
    jwtExpire: '24h',
    
    // File upload limits
    maxFileSize: 5 * 1024 * 1024, // 5MB
    
    // Pagination defaults
    defaultPage: 1,
    defaultLimit: 10,
    
    // Email configuration
    emailFrom: process.env.EMAIL_FROM || 'info@asiancultureexplorer.com',
    
    // Regional settings
    regions: [
      'East Asia',
      'Southeast Asia',
      'South Asia',
      'Central Asia',
      'West Asia'
    ],
    
    // Cultural categories
    categories: [
      'art',
      'cuisine',
      'festival',
      'music',
      'language',
      'religion',
      'tradition',
      'architecture',
      'clothing'
    ]
  };