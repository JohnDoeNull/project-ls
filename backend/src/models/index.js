import mongoose from 'mongoose';
import User from './User';
import Post from './Post';
import Comment from './Comment';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Export models and connection function
export { User, Post, Comment, connectDB };