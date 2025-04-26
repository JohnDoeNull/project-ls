const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// Import the questions data
const vietnamHistoryQuestions = require('../../data/trex-questions');
const User = require('../../models/User');

// Get a random question from the array
function getRandomQuestion() {
  const randomIndex = Math.floor(Math.random() * vietnamHistoryQuestions.length);
  return {
    id: randomIndex,
    ...vietnamHistoryQuestions[randomIndex]
  };
}

// Route to get a random question
router.get('/trex/question', auth, (req, res) => {
  const question = getRandomQuestion();
  
  // Remove the answer before sending to client
  const clientQuestion = { 
    id: question.id,
    question: question.question,
    options: question.options
  };
  
  res.json(clientQuestion);
});

// Route to check an answer
router.post('/trex/answer', auth, (req, res) => {
  const { id, answer } = req.body;
  
  // Check if the question ID is valid
  if (id < 0 || id >= vietnamHistoryQuestions.length) {
    return res.status(400).json({ error: 'Invalid question ID' });
  }
  
  const question = vietnamHistoryQuestions[id];
  const isCorrect = answer === question.answer;
  
  res.json({
    correct: isCorrect,
    correctAnswer: question.answer,
    question: question.question
  });
});

router.post('/trex/score', auth, async (req, res) => {
    const { score } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's score in the database
    if(user.games.tRex.highScore < score) { // Assuming you want to save the highest score
        user.games.tRex.highScore = score; // Assuming you have a score field in your User model
    }

    await user.save();
    
    // Here you would typically save the score to a database
    // For now, we'll just send a success response
    res.json({ message: 'Score saved successfully', score });
    }
);

// top highscore route
router.get('/trex/highscore', auth, async (req, res) => {
    try {
        const users = await User.find({ "games.tRex.highScore": { $gt: 0 } }).sort({ "games.tRex.highScore": -1 }).limit(50); // Get top 50 users with score > 0
        const highScores = users.map(user => ({
            username: user.username,
            score: user.games.tRex.highScore
        }));
        res.json(highScores);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching high scores' });
    }
});

router.get('/trex/myscore', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }   

        const myScore = {
            username: user.username,
            score: user.games.tRex.highScore
        };
        res.json(myScore);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching my score' });
    }
});

module.exports = router;