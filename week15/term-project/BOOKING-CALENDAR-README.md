# Booking Calendar Feature Documentation

## Quick Overview

The Booking Calendar is an interactive reservation system with real-time conflict detection, role-based access control, and responsive design. **Visitors** book through guest portal (`/login`), **admins** manage through separate admin portal (`/admin/login`).

## Features

- Interactive month-based calendar with visual state indicators
- Real-time conflict detection prevents double-bookings
- Role-based access control (visitor vs admin)
- Responsive design (desktop, tablet, mobile)
- Booking management with audit trail
- Admin date blocking capability

## Authentication & Login Flows

### ✨ NEW: Separate Visitor & Admin Portals

**Visitor Flow (Guests)**
- Routes: `/login`, `/register`
- Redirects post-login: → Home page
- Role: `user` (default)
- Permissions: Book properties, view/cancel own reservations

**Admin Flow (Management)**
- Routes: `/admin/login`, `/admin/register`
- Redirects post-login: → `/admin/dashboard`
- Role: `admin`
- Permissions: View all bookings, block dates, manage any reservation

**Key Benefit**: Separate login experiences allow distinct security models and UI tailored to each user type.

### User Roles & Permissions

**Visitor**: View available dates, book stays, view/cancel own reservations
**Admin**: All visitor permissions + block dates, view all bookings, manage any reservation
**Unauthenticated**: Read-only calendar access

## API Endpoints

**GET /api/auth/status** → Returns `{ isAuthenticated, user { id, email, displayName, role } }`

**GET /api/bookings?month=YYYY-MM** → Load bookings for month

**POST /api/bookings** → Create booking or block dates (requires auth)
- Body: `{ startDate, endDate, blockDates, notes }`
- Response: 201 on success, 409 if dates conflict, 403 if permission denied

**DELETE /api/bookings/:id** → Cancel booking (user can cancel own, admin can cancel any)
- Response: 200 on success, 404 if not found, 403 if permission denied

---

## Database Schema

**Booking Model** (`models/Booking.js`)
```
propertyKey, propertyName, guestName, guestEmail
startDate (indexed), endDate (indexed)
status: 'confirmed' | 'cancelled' | 'blocked'
notes, bookedBy { id, email, displayName }, cancelledBy { id, email, displayName }
createdAt, updatedAt
```
**Indexes**: Compound on `(propertyKey, startDate, endDate)` for fast conflict detection.

## Setup

### Backend Routes (server.js)
```javascript
import visitorAuthRoutes from './routes/visitor-auth.js';
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';

app.use('/', visitorAuthRoutes);           // /login, /register, /logout
app.use('/admin', authRoutes);             // /admin/login, /admin/register, /admin/logout  
app.use('/api/bookings', bookingRoutes);   // API endpoints
app.use('/api/auth', authStatusRoutes);    // Auth status
```

### Frontend Integration (App.jsx)
```jsx
import BookingCalendar from './components/booking/BookingCalendar';

<main className="main-content">
  <BookingCalendar />
</main>
```

### Environment URLs
The `getBackendUrl()` utility in `client/src/utils/getBackendUrl.js` handles:
- **Development**: `http://localhost:3000`
- **Production**: `window.location.origin` (same domain for render.com deployment)

## Usage Workflows

**Guest Books a Stay:**
1. Click "Log in" on calendar → `/login` (guest portal)
2. Enter credentials, log in
3. Redirected home with calendar
4. Select dates, submit booking
5. View upcoming reservations, cancel if needed

**Admin Manages Property:**
1. Click "Admin" in header → `/admin/login` (admin portal)
2. Enter admin credentials, log in
3. Redirected to `/admin/dashboard`
4. View/cancel all bookings, block maintenance dates

**Conflict Detection:** If user selects dates that overlap existing bookings, API returns 409 error and shows "Date range conflicts with existing booking"

## API Integration Quick Reference

All API calls require `connect.sid` session cookie from login.

```bash
# Check auth status
curl http://localhost:3000/api/auth/status

# Load bookings
curl "http://localhost:3000/api/bookings?month=2024-03"

# Create booking (POST with JSON body)
curl -X POST -d '{"propertyKey":"hawaii","startDate":"2024-03-15T00:00:00Z","endDate":"2024-03-20T00:00:00Z"}' \
  http://localhost:3000/api/bookings

# Cancel booking (DELETE)
curl -X DELETE http://localhost:3000/api/bookings/<booking_id>
```

## Frontend Component Integration

BookingCalendar is a standalone component that manages its own state and API calls:

```javascript
import BookingCalendar from './components/booking/BookingCalendar';

function HomePage() {
  return <BookingCalendar />;
}
```

It automatically handles authentication checks, API calls, and error display.

## Common Errors

| Status | Issue | Fix |
|--------|-------|-----|
| 401 | Not authenticated | Log in first |
| 403 | Permission denied | Admin permission required |
| 409 | Date conflict | Dates overlap existing booking |
| 400 | Invalid input | Check required fields |

Frontend shows error/success messages auto-clearing after 5 seconds.

## Customization

Edit colors in `BookingCalendar.css`: `.calendar-cell.available` (green), `.calendar-cell.booked` (red), `.calendar-cell.blocked` (dark red)

Responsive breakpoints: 1024px+ (desktop), 768-1023px (tablet), <768px (mobile)

## Testing

- [ ] Guest registers & logs in via `/login`, `/register`
- [ ] Admin logs in via `/admin/login`
- [ ] Calendar loads, month navigation works
- [ ] Date range selection works
- [ ] Booking submission creates calendar entry
- [ ] Conflict detection prevents overlapping bookings
- [ ] Cancel booking removes from calendar
- [ ] Admin sees blocking interface
- [ ] Admin can view all bookings
- [ ] Responsive design on mobile

## Quick Troubleshooting

**Bookings not showing**: Check auth status (DevTools → Cookies → `connect.sid`), verify month format (YYYY-MM), check MongoDB

**Cannot submit**: Verify auth (`/api/auth/status`), fill all fields, select both dates

**Calendar not loading**: Check browser console and network tab for errors, clear cache

**Admin controls missing**: Verify role is "admin" via `/api/auth/status`, refresh page

## Production Deployment

**Security**: Use HTTPS, secure session cookies, verify auth on all routes, validate inputs

**Performance**: DB indexes on (propertyKey, startDate, endDate) optimize conflict checks; paginate for large datasets

**Environment**:
```
NODE_ENV=production
MONGODB_URI=production_url
SESSION_SECRET=random_string
PORT=3000
```

## File Structure

```
routes/
  ├── visitor-auth.js         # Guest login/register (/login, /register) [NEW]
  ├── auth.js                 # Admin auth (/admin/login, /admin/register)
  ├── bookings.js             # API endpoints
  └── auth-status.js          # Session status endpoint

models/
  ├── User.js                 # User schema with role enum
  └── Booking.js              # Booking schema

views/
  ├── visitor-login.ejs       # Guest login [NEW]
  ├── visitor-register.ejs    # Guest registration [NEW]
  ├── login.ejs               # Admin login (labeled "Administrator Portal" now)
  └── register.ejs            # Admin registration

client/src/
  ├── components/booking/BookingCalendar.jsx
  ├── components/booking/BookingCalendar.css
  └── utils/getBackendUrl.js  # Dynamic URL utility (dev vs prod)
```

## Support & Issues

For questions or issues:
1. Check the troubleshooting section above
2. Review error messages in browser console
3. Check MongoDB logs for database errors
4. Verify all files are in correct locations
5. Ensure dependencies are installed: `npm install`

## Version History

- **v1.0** (Current): Initial release with visitor bookings, admin blocking, conflict detection

---

**Last Updated**: May 2024  
**Maintained By**: ICS 385 Course Project  
**License**: Course Assignment
