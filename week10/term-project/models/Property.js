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
  }
}, {
  timestamps: true
});

export default mongoose.model('Property', tourismDataSchema);