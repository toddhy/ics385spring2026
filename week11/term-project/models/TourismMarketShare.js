import mongoose from 'mongoose';

const tourismMarketShareSchema = new mongoose.Schema({
  marketShare: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('TourismMarketShare', tourismMarketShareSchema);