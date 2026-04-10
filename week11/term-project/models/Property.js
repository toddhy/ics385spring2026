import mongoose from 'mongoose';

const tourismDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  island: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: false
  },
  amenities: {
    type: Array,
    required: true
  },
  targetSegment: {
    type: String,
    required: true
  },
  imageURL: {
    type: String,
    required: true
  },
  reviews: [{
    guestName: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: false
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model('Property', tourismDataSchema);