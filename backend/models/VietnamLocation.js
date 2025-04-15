const mongoose = require('mongoose');
const vietnamLocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a location name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  shortDescription: {
    type: String,
    required: [true, 'Please add a short description'],
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  region: {
    type: String,
    required: [true, 'Please add a region'],
    enum: ['North', 'Central', 'South', 'Highlands']
  },
  province: {
    type: String,
    required: [true, 'Please add a province']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['landmark', 'temple', 'museum', 'natural', 'historical', 'village', 'market', 'cultural']
  },
  coordinates: {
    // Geographic coordinates for placing on map
    x: {
      type: Number,
      required: [true, 'Please add x coordinate']
    },
    y: {
      type: Number,
      required: [true, 'Please add y coordinate']
    }
  },
  vrContent: {
    type: {
      type: String,
      required: [true, 'Please specify VR content type'],
      enum: ['matterport', '360-photo', '360-video', '3D-model']
    },
    // For Matterport tours
    matterportId: {
      type: String,
      required: function() {
        return this.vrContent.type === 'matterport';
      }
    },
    // For other VR content types
    mainUrl: {
      type: String,
      required: function() {
        return this.vrContent.type !== 'matterport';
      }
    },
    fallbackUrl: {
      type: String,
      required: false
    },
    format: {
      type: String,
      required: function() {
        return this.vrContent.type !== 'matterport';
      },
      enum: ['equirectangular', 'cubemap', 'glTF', 'OBJ']
    }
  },
  thumbnailImage: {
    type: String,
    required: [true, 'Please add a thumbnail image']
  },
  mapMarkerImage: {
    type: String,
    default: '/images/markers/default-marker.png'
  },
  // Other details remain the same
  historicalContext: {
    type: String,
    required: false
  },
  culturalSignificance: {
    type: String,
    required: false
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String],
  viewCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model('VietnamLocation', vietnamLocationSchema);