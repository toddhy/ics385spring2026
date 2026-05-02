import mongoose from 'mongoose';

const usRegionsDataSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  pacificRegion: {
    type: Number,
    required: true
  },
  mountainRegion: {
    type: Number,
    required: true
  },
  wnCentralRegion: {
    type: Number,
    required: true
  },
  wsCentralRegion: {
    type: Number,
    required: true
  },
  enCentralRegion: {
    type: Number,
    required: true
  },
  esCentralRegion: {
    type: Number,
    required: true
  },
  newEnglandRegion: {
    type: Number,
    required: true
  },
  midAtlanticRegion: {
    type: Number,
    required: true
  },
  sAtlanticRegion: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('USRegionsData', usRegionsDataSchema);
