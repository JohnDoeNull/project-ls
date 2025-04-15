// controllers/gameController.js
const { Game, UserProgress } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all games
// @route   GET /api/games
// @access  Public
exports.getGames = asyncHandler(async (req, res, next) => {
  const { region, country, category, type, difficulty } = req.query;
  const filter = {};

  // Apply filters if provided
  if (region) filter.region = region;
  if (country) filter.country = country;
  if (category) filter.category = category;
  if (type) filter.type = type;
  if (difficulty) filter.difficultyLevel = difficulty;

  const games = await Game.find(filter)
    .select('title description region country category type thumbnailImage difficultyLevel estimatedDuration');

  res.status(200).json({
    success: true,
    count: games.length,
    data: games
  });
});

// @desc    Get single game
// @route   GET /api/games/:id
// @access  Public
exports.getGame = asyncHandler(async (req, res, next) => {
  const game = await Game.findById(req.params.id);

  if (!game) {
    return next(new ErrorResponse(`Game not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: game
  });
});

// @desc    Start a game (record start time)
// @route   POST /api/games/:id/start
// @access  Private
exports.startGame = asyncHandler(async (req, res, next) => {
  const game = await Game.findById(req.params.id);

  if (!game) {
    return next(new ErrorResponse(`Game not found with id of ${req.params.id}`, 404));
  }

  // Get or create user progress record
  let userProgress = await UserProgress.findOne({ user: req.user.id });
  
  if (!userProgress) {
    userProgress = await UserProgress.create({ user: req.user.id });
  }

  // Check if user already started this game
  const existingSession = userProgress.gamesPlayed.find(
    session => session.game.toString() === req.params.id
  );

  if (existingSession) {
    // Update existing session
    existingSession.startTime = new Date();
    existingSession.score = 0;
    existingSession.completionPercentage = 0;
    existingSession.achievements = [];
  } else {
    // Add new session
    userProgress.gamesPlayed.push({
      game: req.params.id,
      startTime: new Date(),
      score: 0,
      completionPercentage: 0,
      achievements: []
    });
  }

  await userProgress.save();

  res.status(200).json({
    success: true,
    message: 'Game session started',
    data: {
      gameId: game._id,
      startTime: new Date(),
      gamePath: game.gamePath
    }
  });
});

// @desc    Update game progress
// @route   PUT /api/games/:id/progress
// @access  Private
exports.updateGameProgress = asyncHandler(async (req, res, next) => {
  const { score, completionPercentage, achievements } = req.body;

  // Find user progress
  const userProgress = await UserProgress.findOne({ user: req.user.id });
  
  if (!userProgress) {
    return next(new ErrorResponse('User progress not found', 404));
  }

  // Find the specific game session
  const sessionIndex = userProgress.gamesPlayed.findIndex(
    session => session.game.toString() === req.params.id
  );

  if (sessionIndex === -1) {
    return next(new ErrorResponse('Game session not started', 404));
  }

  // Update fields if provided
  if (score !== undefined) {
    userProgress.gamesPlayed[sessionIndex].score = score;
  }

  if (completionPercentage !== undefined) {
    userProgress.gamesPlayed[sessionIndex].completionPercentage = completionPercentage;
  }

  if (achievements && achievements.length > 0) {
    // Add only unique achievements
    const currentAchievements = userProgress.gamesPlayed[sessionIndex].achievements;
    achievements.forEach(achievement => {
      if (!currentAchievements.includes(achievement)) {
        currentAchievements.push(achievement);
      }
    });
  }

  // Update last active time
  userProgress.lastActive = new Date();

  await userProgress.save();

  res.status(200).json({
    success: true,
    message: 'Game progress updated',
    data: userProgress.gamesPlayed[sessionIndex]
  });
});

// @desc    Complete game session
// @route   PUT /api/games/:id/complete
// @access  Private
exports.completeGame = asyncHandler(async (req, res, next) => {
  const { finalScore } = req.body;

  // Find user progress
  const userProgress = await UserProgress.findOne({ user: req.user.id });
  
  if (!userProgress) {
    return next(new ErrorResponse('User progress not found', 404));
  }

  // Find the specific game session
  const sessionIndex = userProgress.gamesPlayed.findIndex(
    session => session.game.toString() === req.params.id
  );

  if (sessionIndex === -1) {
    return next(new ErrorResponse('Game session not started', 404));
  }

  // Mark as complete
  userProgress.gamesPlayed[sessionIndex].endTime = new Date();
  userProgress.gamesPlayed[sessionIndex].completionPercentage = 100;
  
  if (finalScore !== undefined) {
    userProgress.gamesPlayed[sessionIndex].score = finalScore;
  }
  
  // Calculate points based on score
  const pointsEarned = Math.floor(userProgress.gamesPlayed[sessionIndex].score / 10) + 50;
  userProgress.learningPath.totalPoints += pointsEarned;

  // Get game details
  const game = await Game.findById(req.params.id);

  // Update region progress
  const regionIndex = userProgress.learningPath.regions.findIndex(
    r => r.name === game.region
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
      name: game.region,
      progressPercentage: 5
    });
  }

  // Update category progress
  const categoryIndex = userProgress.learningPath.categories.findIndex(
    c => c.name === game.category
  );

  if (categoryIndex !== -1) {
    // Update existing category progress
    userProgress.learningPath.categories[categoryIndex].progressPercentage += 5;
    // Cap at 100%
    if (userProgress.learningPath.categories[categoryIndex].progressPercentage > 100) {
      userProgress.learningPath.categories[categoryIndex].progressPercentage = 100;
    }
  } else {
    // Add new category
    userProgress.learningPath.categories.push({
      name: game.category,
      progressPercentage: 5
    });
  }

  // Update last active time
  userProgress.lastActive = new Date();

  await userProgress.save();

  res.status(200).json({
    success: true,
    message: 'Game completed',
    data: {
      pointsEarned,
      totalPoints: userProgress.learningPath.totalPoints,
      score: userProgress.gamesPlayed[sessionIndex].score,
      completionTime: userProgress.gamesPlayed[sessionIndex].endTime
    }
  });
});

// controllers/storyController.js
const { Story, UserProgress } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all stories
// @route   GET /api/stories
// @access  Public
exports.getStories = asyncHandler(async (req, res, next) => {
  const { region, country, category, ageGroup } = req.query;
  const filter = {};

  // Apply filters if provided
  if (region) filter.region = region;
  if (country) filter.country = country;
  if (category) filter.category = category;
  if (ageGroup) filter.ageGroup = ageGroup;

  const stories = await Story.find(filter)
    .select('title description region country category thumbnailImage duration ageGroup');

  res.status(200).json({
    success: true,
    count: stories.length,
    data: stories
  });
});

// @desc    Get single story
// @route   GET /api/stories/:id
// @access  Public
exports.getStory = asyncHandler(async (req, res, next) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    return next(new ErrorResponse(`Story not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: story
  });
});

// @desc    Start watching a story (record start time)
// @route   POST /api/stories/:id/start
// @access  Private
exports.startStory = asyncHandler(async (req, res, next) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    return next(new ErrorResponse(`Story not found with id of ${req.params.id}`, 404));
  }

  // Get or create user progress record
  let userProgress = await UserProgress.findOne({ user: req.user.id });
  
  if (!userProgress) {
    userProgress = await UserProgress.create({ user: req.user.id });
  }

  // Check if user already started this story
  const existingSession = userProgress.storiesWatched.find(
    session => session.story.toString() === req.params.id
  );

  if (existingSession) {
    // Update existing session
    existingSession.startTime = new Date();
    existingSession.watchPercentage = 0;
    existingSession.quizScore = 0;
  } else {
    // Add new session
    userProgress.storiesWatched.push({
      story: req.params.id,
      startTime: new Date(),
      watchPercentage: 0,
      quizScore: 0
    });
  }

  await userProgress.save();

  // If story has a quiz, include quiz ID in response
  const quizId = story.hasQuiz ? story.quiz : null;

  res.status(200).json({
    success: true,
    message: 'Story watching started',
    data: {
      storyId: story._id,
      startTime: new Date(),
      videoUrl: story.videoUrl,
      transcriptText: story.transcriptText,
      hasQuiz: story.hasQuiz,
      quizId
    }
  });
});

// @desc    Update story watching progress
// @route   PUT /api/stories/:id/progress
// @access  Private
exports.updateStoryProgress = asyncHandler(async (req, res, next) => {
  const { watchPercentage, quizScore } = req.body;

  // Find user progress
  const userProgress = await UserProgress.findOne({ user: req.user.id });
  
  if (!userProgress) {
    return next(new ErrorResponse('User progress not found', 404));
  }

  // Find the specific story session
  const sessionIndex = userProgress.storiesWatched.findIndex(
    session => session.story.toString() === req.params.id
  );

  if (sessionIndex === -1) {
    return next(new ErrorResponse('Story watching session not started', 404));
  }

  // Update fields if provided
  if (watchPercentage !== undefined) {
    userProgress.storiesWatched[sessionIndex].watchPercentage = watchPercentage;
  }

  if (quizScore !== undefined) {
    userProgress.storiesWatched[sessionIndex].quizScore = quizScore;
  }

  // Update last active time
  userProgress.lastActive = new Date();

  await userProgress.save();

  res.status(200).json({
    success: true,
    message: 'Story watching progress updated',
    data: userProgress.storiesWatched[sessionIndex]
  });
});

// @desc    Complete story watching
// @route   PUT /api/stories/:id/complete
// @access  Private
exports.completeStory = asyncHandler(async (req, res, next) => {
  const { quizScore } = req.body;

  // Find user progress
  const userProgress = await UserProgress.findOne({ user: req.user.id });
  
  if (!userProgress) {
    return next(new ErrorResponse('User progress not found', 404));
  }

  // Find the specific story session
  const sessionIndex = userProgress.storiesWatched.findIndex(
    session => session.story.toString() === req.params.id
  );

  if (sessionIndex === -1) {
    return next(new ErrorResponse('Story watching session not started', 404));
  }

  // Mark as complete
  userProgress.storiesWatched[sessionIndex].endTime = new Date();
  userProgress.storiesWatched[sessionIndex].watchPercentage = 100;
  
  if (quizScore !== undefined) {
    userProgress.storiesWatched[sessionIndex].quizScore = quizScore;
  }
  
  // Calculate points - base points for watching + bonus for quiz if taken
  let pointsEarned = 50; // Base points for watching
  
  // Add bonus points for quiz score if applicable
  if (quizScore !== undefined) {
    pointsEarned += Math.floor(quizScore / 2); // Up to 50 bonus points for perfect quiz
  }
  
  userProgress.learningPath.totalPoints += pointsEarned;

  // Get story details
  const story = await Story.findById(req.params.id);

  // Update region progress
  const regionIndex = userProgress.learningPath.regions.findIndex(
    r => r.name === story.region
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
      name: story.region,
      progressPercentage: 5
    });
  }

  // Update category progress
  const categoryIndex = userProgress.learningPath.categories.findIndex(
    c => c.name === story.category
  );

  if (categoryIndex !== -1) {
    // Update existing category progress
    userProgress.learningPath.categories[categoryIndex].progressPercentage += 5;
    // Cap at 100%
    if (userProgress.learningPath.categories[categoryIndex].progressPercentage > 100) {
      userProgress.learningPath.categories[categoryIndex].progressPercentage = 100;
    }
  } else {
    // Add new category
    userProgress.learningPath.categories.push({
      name: story.category,
      progressPercentage: 5
    });
  }

  // Update last active time
  userProgress.lastActive = new Date();

  await userProgress.save();

  res.status(200).json({
    success: true,
    message: 'Story completed',
    data: {
      pointsEarned,
      totalPoints: userProgress.learningPath.totalPoints,
      quizScore: userProgress.storiesWatched[sessionIndex].quizScore,
      completionTime: userProgress.storiesWatched[sessionIndex].endTime
    }
  });
});

// controllers/chatbotController.js
const { ChatbotTopic, UserProgress } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all chatbot topics
// @route   GET /api/chatbot/topics
// @access  Public
exports.getChatbotTopics = asyncHandler(async (req, res, next) => {
  const { region, country, category } = req.query;
  const filter = {};

  // Apply filters if provided
  if (region) filter.region = region;
  if (country) filter.country = country;
  if (category) filter.category = category;

  const topics = await ChatbotTopic.find(filter)
    .select('title category region country');

  res.status(200).json({
    success: true,
    count: topics.length,
    data: topics
  });
});

// @desc    Get single chatbot topic
// @route   GET /api/chatbot/topics/:id
// @access  Public
exports.getChatbotTopic = asyncHandler(async (req, res, next) => {
  const topic = await ChatbotTopic.findById(req.params.id);

  if (!topic) {
    return next(new ErrorResponse(`Chatbot topic not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: topic
  });
});

// @desc    Ask a question to the chatbot
// @route   POST /api/chatbot/ask
// @access  Private
exports.askQuestion = asyncHandler(async (req, res, next) => {
  const { topicId, question } = req.body;

  if (!topicId || !question) {
    return next(new ErrorResponse('Please provide topic ID and question', 400));
  }

  // Get topic
  const topic = await ChatbotTopic.findById(topicId);

  if (!topic) {
    return next(new ErrorResponse(`Chatbot topic not found with id of ${topicId}`, 404));
  }

  // Simple keyword matching to find the most relevant response
  // In a real implementation, this would use NLP or an external AI service
  let bestResponse = null;
  let bestMatch = 0;

  topic.responses.forEach(response => {
    // Simple keyword matching
    const keywords = [...topic.keyphrases, response.question.toLowerCase()];
    const userQuestion = question.toLowerCase();
    
    let matchScore = 0;
    keywords.forEach(keyword => {
      if (userQuestion.includes(keyword.toLowerCase())) {
        matchScore++;
      }
    });

    if (matchScore > bestMatch) {
      bestMatch = matchScore;
      bestResponse = response;
    }
  });

  // If no matching response found, use a default response
  if (!bestResponse) {
    bestResponse = {
      question: "No match",
      answer: "I'm sorry, I don't have specific information about that. Would you like to learn about something else related to this topic?",
      followUpQuestions: ["Tell me about the culture", "What are important traditions?", "What is the history?"]
    };
  }

  // Record this interaction in user progress
  let userProgress = await UserProgress.findOne({ user: req.user.id });
  
  if (!userProgress) {
    userProgress = await UserProgress.create({ user: req.user.id });
  }

  // Check if user already has interactions with this topic
  const topicIndex = userProgress.chatbotInteractions.findIndex(
    interaction => interaction.topic.toString() === topicId
  );

  if (topicIndex !== -1) {
    // Add to existing interaction
    userProgress.chatbotInteractions[topicIndex].questionsAsked.push({
      question,
      timestamp: new Date()
    });
    userProgress.chatbotInteractions[topicIndex].conversationLength += 1;
  } else {
    // Create new interaction
    userProgress.chatbotInteractions.push({
      topic: topicId,
      questionsAsked: [{
        question,
        timestamp: new Date()
      }],
      conversationLength: 1,
      satisfactionRating: null
    });
  }

  // Update last active time
  userProgress.lastActive = new Date();

  await userProgress.save();

  res.status(200).json({
    success: true,
    data: {
      answer: bestResponse.answer,
      followUpQuestions: bestResponse.followUpQuestions
    }
  });
});

// @desc    Get chatbot rate limit info
// @route   GET /api/chatbot/rate-limit
// @access  Private
exports.getRateLimit = asyncHandler(async (req, res, next) => {
  // In a real implementation, this would check against a rate limit database
  // For now, we'll just return a dummy response
  
  res.status(200).json({
    success: true,
    data: {
      questionsRemaining: 50,
      resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    }
  });
});

// @desc    Provide feedback for chatbot interaction
// @route   POST /api/chatbot/feedback
// @access  Private
exports.provideFeedback = asyncHandler(async (req, res, next) => {
  const { topicId, satisfactionRating } = req.body;

  if (!topicId || satisfactionRating === undefined) {
    return next(new ErrorResponse('Please provide topic ID and satisfaction rating', 400));
  }

  // Validate rating is between 1-5
  if (satisfactionRating < 1 || satisfactionRating > 5) {
    return next(new ErrorResponse('Satisfaction rating must be between 1 and 5', 400));
  }

  // Get user progress
  const userProgress = await UserProgress.findOne({ user: req.user.id });
  
  if (!userProgress) {
    return next(new ErrorResponse('User progress not found', 404));
  }

  // Find the specific topic interaction
  const topicIndex = userProgress.chatbotInteractions.findIndex(
    interaction => interaction.topic.toString() === topicId
  );

  if (topicIndex === -1) {
    return next(new ErrorResponse('No chatbot interaction found for this topic', 404));
  }

  // Update satisfaction rating
  userProgress.chatbotInteractions[topicIndex].satisfactionRating = satisfactionRating;

  // Update last active time
  userProgress.lastActive = new Date();

  await userProgress.save();

  // Award points for providing feedback
  userProgress.learningPath.totalPoints += 5;

  await userProgress.save();

  res.status(200).json({
    success: true,
    message: 'Feedback recorded',
    data: {
      pointsEarned: 5,
      totalPoints: userProgress.learningPath.totalPoints
    }
  });
});

// controllers/progressController.js
const { UserProgress, VirtualLocation, Comic, Game, Story } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get user progress
// @route   GET /api/progress
// @access  Private
exports.getUserProgress = asyncHandler(async (req, res, next) => {
  // Find user progress with populated references
  const userProgress = await UserProgress.findOne({ user: req.user.id })
    .populate({
      path: 'vrExperiences.location',
      select: 'name region category'
    })
    .populate({
      path: 'comicsRead.comic',
      select: 'title region category'
    })
    .populate({
      path: 'gamesPlayed.game',
      select: 'title region category type'
    })
    .populate({
      path: 'storiesWatched.story',
      select: 'title region category'
    })
    .populate({
      path: 'chatbotInteractions.topic',
      select: 'title region category'
    });
  
  if (!userProgress) {
    // Create new progress record if none exists
    const newProgress = await UserProgress.create({
      user: req.user.id,
      learningPath: {
        currentLevel: 'beginner',
        regions: [],
        categories: [],
        totalPoints: 0,
        achievements: []
      }
    });

    return res.status(200).json({
      success: true,
      data: newProgress
    });
  }

  // Calculate overall statistics
  const stats = {
    vrExperiencesCompleted: userProgress.vrExperiences.filter(exp => exp.completionPercentage === 100).length,
    comicsCompleted: userProgress.comicsRead.filter(comic => comic.completionPercentage === 100).length,
    gamesCompleted: userProgress.gamesPlayed.filter(game => game.completionPercentage === 100).length,
    storiesWatched: userProgress.storiesWatched.filter(story => story.watchPercentage === 100).length,
    chatbotInteractions: userProgress.chatbotInteractions.reduce((total, interaction) => total + interaction.conversationLength, 0),
    regionsExplored: userProgress.learningPath.regions.length,
    categoriesExplored: userProgress.learningPath.categories.length,
    totalPoints: userProgress.learningPath.totalPoints,
    totalAchievements: userProgress.learningPath.achievements.length
  };

  res.status(200).json({
    success: true,
    data: userProgress,
    stats
  });
});

// @desc    Get user achievements
// @route   GET /api/progress/achievements
// @access  Private
exports.getAchievements = asyncHandler(async (req, res, next) => {
  // Find user progress
  const userProgress = await UserProgress.findOne({ user: req.user.id });
  
  if (!userProgress) {
    return next(new ErrorResponse('User progress not found', 404));
  }

  // Get earned achievements
  const earnedAchievements = userProgress.learningPath.achievements;

  // Define all possible achievements
  const allAchievements = [
    {
      id: 'explorer_novice',
      name: 'Cultural Explorer Novice',
      description: 'Complete 5 cultural activities',
      iconUrl: '/images/achievements/explorer_novice.png',
      criteria: () => {
        const total = userProgress.vrExperiences.filter(exp => exp.completionPercentage === 100).length +
                    userProgress.comicsRead.filter(comic => comic.completionPercentage === 100).length +
                    userProgress.gamesPlayed.filter(game => game.completionPercentage === 100).length +
                    userProgress.storiesWatched.filter(story => story.watchPercentage === 100).length;
        return total >= 5;
      }
    },
    {
      id: 'explorer_intermediate',
      name: 'Cultural Explorer Intermediate',
      description: 'Complete 20 cultural activities',
      iconUrl: '/images/achievements/explorer_intermediate.png',
      criteria: () => {
        const total = userProgress.vrExperiences.filter(exp => exp.completionPercentage === 100).length +
                    userProgress.comicsRead.filter(comic => comic.completionPercentage === 100).length +
                    userProgress.gamesPlayed.filter(game => game.completionPercentage === 100).length +
                    userProgress.storiesWatched.filter(story => story.watchPercentage === 100).length;
        return total >= 20;
      }
    },
    {
      id: 'explorer_advanced',
      name: 'Cultural Explorer Advanced',
      description: 'Complete 50 cultural activities',
      iconUrl: '/images/achievements/explorer_advanced.png',
      criteria: () => {
        const total = userProgress.vrExperiences.filter(exp => exp.completionPercentage === 100).length +
                    userProgress.comicsRead.filter(comic => comic.completionPercentage === 100).length +
                    userProgress.gamesPlayed.filter(game => game.completionPercentage === 100).length +
                    userProgress.storiesWatched.filter(story => story.watchPercentage === 100).length;
        return total >= 50;
      }
    },
    {
      id: 'vr_enthusiast',
      name: 'VR Enthusiast',
      description: 'Complete 10 VR experiences',
      iconUrl: '/images/achievements/vr_enthusiast.png',
      criteria: () => userProgress.vrExperiences.filter(exp => exp.completionPercentage === 100).length >= 10