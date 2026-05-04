import express from 'express';
import Booking from '../models/Booking.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

const PROPERTY_KEY = 'upcountry-honeymoon-getaway';
const PROPERTY_NAME = 'Upcountry Honeymoon Getaway';
const ACTIVE_STATUSES = ['confirmed', 'blocked'];

function normalizeBooking(booking) {
  const plain = booking.toObject ? booking.toObject() : booking;

  return {
    ...plain,
    _id: plain._id?.toString ? plain._id.toString() : plain._id,
    bookedBy: plain.bookedBy
      ? {
          ...plain.bookedBy,
          userId: plain.bookedBy.userId?.toString ? plain.bookedBy.userId.toString() : plain.bookedBy.userId,
        }
      : null,
    cancelledBy: plain.cancelledBy
      ? {
          ...plain.cancelledBy,
          userId: plain.cancelledBy.userId?.toString ? plain.cancelledBy.userId.toString() : plain.cancelledBy.userId,
        }
      : null,
  };
}

function getMonthBounds(monthValue) {
  const now = new Date();
  let year = now.getFullYear();
  let monthIndex = now.getMonth();

  if (monthValue && /^\d{4}-\d{2}$/.test(monthValue)) {
    const [monthYear, monthNumber] = monthValue.split('-');
    year = Number(monthYear);
    monthIndex = Number(monthNumber) - 1;
  }

  const start = new Date(year, monthIndex, 1, 0, 0, 0, 0);
  const end = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

  return { start, end };
}

function parseDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
}

function createUserSnapshot(user) {
  return {
    userId: user._id,
    email: user.email,
    displayName: user.displayName || user.email,
    role: user.role,
  };
}

// GET /api/bookings?month=YYYY-MM - load active bookings for a month
router.get('/', async (req, res) => {
  try {
    const { month } = req.query;
    const { start, end } = getMonthBounds(month);

    const bookings = await Booking.find({
      propertyKey: PROPERTY_KEY,
      status: { $in: ACTIVE_STATUSES },
      startDate: { $lte: end },
      endDate: { $gte: start },
    }).sort({ startDate: 1, createdAt: 1 });

    res.json(bookings.map(normalizeBooking));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/bookings - create a booking or admin block
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { startDate, endDate, notes = '', blockDates = false, guestName = '', guestEmail = '' } = req.body;
    const parsedStart = parseDate(startDate);
    const parsedEnd = parseDate(endDate);
    const isAdmin = req.user.role === 'admin';
    const trimmedNotes = typeof notes === 'string' ? notes.trim() : '';

    if (!parsedStart || !parsedEnd) {
      return res.status(400).json({ error: 'Valid start and end dates are required.' });
    }

    if (parsedEnd < parsedStart) {
      return res.status(400).json({ error: 'End date must be on or after the start date.' });
    }

    if (blockDates && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only administrators can block dates.' });
    }

    if (isAdmin && !blockDates) {
      if (!guestName.trim() || !guestEmail.trim()) {
        return res.status(400).json({ error: 'Visitor name and email are required for administrator bookings.' });
      }
    }

    const conflict = await Booking.findOne({
      propertyKey: PROPERTY_KEY,
      status: { $in: ACTIVE_STATUSES },
      startDate: { $lte: parsedEnd },
      endDate: { $gte: parsedStart },
    });

    if (conflict) {
      return res.status(409).json({ error: 'That date range is already reserved.' });
    }

    const booking = await Booking.create({
      propertyKey: PROPERTY_KEY,
      propertyName: PROPERTY_NAME,
      guestName: isAdmin && !blockDates ? guestName.trim() : req.user.displayName || req.user.email,
      guestEmail: isAdmin && !blockDates ? guestEmail.trim() : req.user.email,
      startDate: parsedStart,
      endDate: parsedEnd,
      status: blockDates && req.user.role === 'admin' ? 'blocked' : 'confirmed',
      notes: trimmedNotes,
      bookedBy: createUserSnapshot(req.user),
    });

    res.status(201).json(normalizeBooking(booking));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/bookings/:id - cancel your own booking or any booking as admin
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      propertyKey: PROPERTY_KEY,
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    const isOwner = booking.bookedBy?.userId && booking.bookedBy.userId.toString() === req.user._id.toString();
    const canCancel = req.user.role === 'admin' || isOwner;

    if (!canCancel) {
      return res.status(403).json({ error: 'You can only cancel your own booking.' });
    }

    if (booking.status === 'cancelled') {
      return res.json(normalizeBooking(booking));
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancelledBy = createUserSnapshot(req.user);
    await booking.save();

    res.json(normalizeBooking(booking));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
