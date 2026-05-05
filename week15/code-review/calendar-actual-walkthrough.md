# Real Calendar Implementation Walkthrough (Commit b6eb14b)

This walkthrough covers the actual calendar implementation for the honeymoon property, based on the `b6eb14b` project history.

## 1. Data Model ([week15/term-project/models/Booking.js](week15/term-project/models/Booking.js))
The core data structure supports guest bookings and admin blocks. Lines [L34-L38](week15/term-project/models/Booking.js#L34-L38) define the main status types.

- **Status Enum:** Supports `confirmed`, `cancelled`, and `blocked`.
- **User Snapshots:** Stores `bookedBy` (Lines [L42-L56](week15/term-project/models/Booking.js#L42-L56)) and `cancelledBy` snapshots (User ID, email, role) to maintain history regardless of future profile changes.
- **Indexes:** Compound index on `propertyKey`, `startDate`, `endDate`, and `status` for fast availability queries (Line [L86](week15/term-project/models/Booking.js#L86)).

---

## 2. Backend Routes ([week15/term-project/routes/bookings.js](week15/term-project/routes/bookings.js))

### Availability Query
Retrieves active bookings that overlap with a requested month. Logic starts at Line [L63](week15/term-project/routes/bookings.js#L63).
```javascript
// GET /api/bookings?month=YYYY-MM
const { start, end } = getMonthBounds(month);
const bookings = await Booking.find({
  propertyKey: PROPERTY_KEY,
  status: { $in: ACTIVE_STATUSES },
  startDate: { $lte: end },
  endDate: { $gte: start },
}).sort({ startDate: 1, createdAt: 1 });
```

### Conflict Detection
Before creating a new booking (Lines [L84-L127](week15/term-project/routes/bookings.js#L84-L127)), the server checks if any part of the requested range intersects an existing stay.
```javascript
// POST /api/bookings
const conflict = await Booking.findOne({
  propertyKey: PROPERTY_KEY,
  status: { $in: ACTIVE_STATUSES },
  startDate: { $lte: parsedEnd }, // Booking starts before requested ends
  endDate: { $gte: parsedStart }, // Booking ends after requested starts
});
```

---

## 3. Frontend Component ([week15/term-project/client/src/components/booking/BookingCalendar.jsx](week15/term-project/client/src/components/booking/BookingCalendar.jsx))

### Grid Construction
The calendar is built dynamically for the selected month using a helper function at Line [L63](week15/term-project/client/src/components/booking/BookingCalendar.jsx#L63).
```javascript
function buildMonthCells(monthDate, bookings) {
  const startDay = firstOfMonth.getDay(); // e.g., 2 for Tuesday
  const totalDays = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: startDay }, () => null); // Blank padding

  for (let dayNumber = 1; dayNumber <= totalDays; dayNumber += 1) {
    const key = toLocalDateKey(date);
    // Find booking that covers this day
    const booking = bookings.find((item) => item.startKey <= key && item.endKey >= key);
    cells.push({ date, key, dayNumber, booking });
  }
  return cells;
}
```

### Interaction: `handleDayClick`
Handles range selection (start -> end) at Line [L210](week15/term-project/client/src/components/booking/BookingCalendar.jsx#L210).
1. If no start date, or selection is finished -> set target as `startDate`.
2. If pick is before start -> swap them to keep the range logical.
3. Otherwise -> set as `endDate`.

### Submission
Final submission logic and auth check at Line [L229](week15/term-project/client/src/components/booking/BookingCalendar.jsx#L229).
```javascript
const handleSubmit = async (event) => {
  event.preventDefault();

  if (!auth.authenticated) {
    window.location.assign(getAdminUrl('/login'));
    return;
  }
```

---

## 4. Security & Roles
- **Authenticated Access:** All write operations requires `isAuthenticated` middleware (Lines [L84](week15/term-project/routes/bookings.js#L84) and [L129](week15/term-project/routes/bookings.js#L129)).
- **Admin Blocks:** The `blockDates` flag is only respected if the user's role is `admin` (Line [L100](week15/term-project/routes/bookings.js#L100)).
- **Cancellations:** Logic at Line [L129](week15/term-project/routes/bookings.js#L129) ensures users can only cancel their own bookings (via ID check).

---

## 5. Google Authentication (Commit `ddb439b`)
Integrated Google OAuth for visitor login using separate strategies for Admin vs User roles.

- **Visitor Auth [L88-L135](week15/term-project/routes/visitor-auth.js#L88-L135):** Handles the Google callback for users, ensuring they are created with the `user` role (Line [L118](week15/term-project/routes/visitor-auth.js#L118)).
- **Admin Auth [L88-L135](week15/term-project/routes/auth.js#L88-L135):** Handles Google callback for admins, validating the `admin` role before redirecting to the dashboard.
- **Passport Strategies:** In [week15/term-project/passport-config.js](week15/term-project/passport-config.js), separate strategies `admin-google` (Line [L80](week15/term-project/passport-config.js#L80)) and `user-google` (Line [L87](week15/term-project/passport-config.js#L87)) use different callback URLs to maintain portal separation.

---

## 6. Admin Dashboard Transformation (Commit `98a0b66`)
The admin dashboard was repurposed to use the shared `BookingCalendar` component, allowing administrators to manage all reservations in a visual grid.

- **Admin Logic:** [week15/term-project/routes/admin.js](week15/term-project/routes/admin.js) ensures only users with the `admin` role (Line [L17](week15/term-project/routes/admin.js#L17)) can access the dashboard.
- **Component Reuse:** The `BookingCalendar` component in [week15/term-project/client/src/components/booking/BookingCalendar.jsx](week15/term-project/client/src/components/booking/BookingCalendar.jsx) uses role-based rendering to show additional controls (like site-wide cancellations or date blocking) only to admins.
