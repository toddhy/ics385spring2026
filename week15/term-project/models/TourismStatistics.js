import mongoose from 'mongoose';

const tourismStatisticsSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  arrivals: {
    type: Number,
    required: true
  },
  expenditure: {
    type: Number,
    required: true
  },
  lengthOfStay: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('TourismStatistics', tourismStatisticsSchema);
