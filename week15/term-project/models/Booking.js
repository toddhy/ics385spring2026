import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    propertyKey: {
      type: String,
      required: true,
      index: true,
    },
    propertyName: {
      type: String,
      required: true,
    },
    guestName: {
      type: String,
      required: true,
      trim: true,
    },
    guestEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
      index: true,
    },
    endDate: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'blocked'],
      default: 'confirmed',
      index: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    bookedBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      email: {
        type: String,
      },
      displayName: {
        type: String,
      },
      role: {
        type: String,
        enum: ['user', 'admin'],
      },
    },
    cancelledBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      email: {
        type: String,
      },
      displayName: {
        type: String,
      },
      role: {
        type: String,
        enum: ['user', 'admin'],
      },
    },
    cancelledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ propertyKey: 1, startDate: 1, endDate: 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
