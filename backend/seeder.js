const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const VietnamLocation = require('./models/VietnamLocation');

// Connect to DB
mongoose.connect("mongodb+srv://tuan:tuan@sturdypath.xhl7u2i.mongodb.net/?retryWrites=true&w=majority&appName=sturdypath", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Read JSON files
const locations = require('./data/locations');
const User = require('./models/User');

// Import into DB
const importData = async () => {
  try {
    await User.updateMany({}, { $set: { 'games.tRex.highScore': 0 } });
    // await VietnamLocation.create(locations);
    
    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await VietnamLocation.deleteMany();
    
    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please add an option: -i (import) or -d (delete)');
  process.exit();
}