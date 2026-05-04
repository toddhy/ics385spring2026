import { useEffect, useMemo, useState } from 'react';
import './BookingCalendar.css';
import { getBackendUrl } from '../../utils/getBackendUrl';

const PROPERTY_KEY = 'upcountry-honeymoon-getaway';
const PROPERTY_NAME = 'Upcountry Honeymoon Getaway';

function toLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function fromDateInput(value) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function toDateInputValue(date) {
  if (!date) {
    return '';
  }

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().split('T')[0];
}

function normalizeBooking(booking) {
  const start = new Date(booking.startDate);
  const end = new Date(booking.endDate);

  return {
    ...booking,
    startKey: toLocalDateKey(start),
    endKey: toLocalDateKey(end),
    _id: booking._id?.toString ? booking._id.toString() : booking._id,
    bookedBy: booking.bookedBy
      ? {
          ...booking.bookedBy,
          userId: booking.bookedBy.userId?.toString ? booking.bookedBy.userId.toString() : booking.bookedBy.userId,
        }
      : null,
  };
}

function formatRange(startKey, endKey) {
  const start = fromDateInput(startKey);
  const end = fromDateInput(endKey);

  if (!start || !end) {
    return '';
  }

  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

function getMonthLabel(date) {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function buildMonthCells(monthDate, bookings) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstOfMonth = new Date(year, month, 1, 12, 0, 0, 0);
  const startDay = firstOfMonth.getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: startDay }, () => null);

  for (let dayNumber = 1; dayNumber <= totalDays; dayNumber += 1) {
    const date = new Date(year, month, dayNumber, 12, 0, 0, 0);
    const key = toLocalDateKey(date);
    const booking = bookings.find((item) => item.startKey <= key && item.endKey >= key);

    cells.push({
      date,
      key,
      dayNumber,
      booking,
    });
  }

  return cells;
}

export default function BookingCalendar() {
  const [auth, setAuth] = useState({ authenticated: false, user: null });
  const [bookings, setBookings] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [blockDates, setBlockDates] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const monthKey = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }, [currentMonth]);

  const activeBookings = useMemo(
    () => bookings.filter((booking) => booking.status !== 'cancelled'),
    [bookings]
  );

  const myBookings = useMemo(() => {
    if (!auth.user) {
      return [];
    }

    return activeBookings.filter((booking) => booking.bookedBy?.userId === auth.user.id);
  }, [activeBookings, auth.user]);

  const canManageAllBookings = auth.user?.role === 'admin';
  const monthCells = useMemo(() => buildMonthCells(currentMonth, activeBookings), [currentMonth, activeBookings]);

  const selectedConflict = useMemo(() => {
    if (!startDate || !endDate) {
      return false;
    }

    return activeBookings.some((booking) => booking.startKey <= endDate && booking.endKey >= startDate);
  }, [activeBookings, endDate, startDate]);

  const selectedNights = useMemo(() => {
    if (!startDate || !endDate) {
      return 0;
    }

    const start = fromDateInput(startDate);
    const end = fromDateInput(endDate);

    if (!start || !end) {
      return 0;
    }

    const dayMillis = 24 * 60 * 60 * 1000;
    return Math.max(1, Math.round((end - start) / dayMillis) + 1);
  }, [endDate, startDate]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${getBackendUrl()}/api/auth/status`, {
          headers: {
            Accept: 'application/json',
          },
          credentials: 'include'
        });

        const status = await response.json();
        setAuth(status);
      } catch (requestError) {
        setAuth({ authenticated: false, user: null });
      }
    };

    fetchStatus();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${getBackendUrl()}/api/bookings?month=${monthKey}`, {
          headers: {
            Accept: 'application/json',
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to load booking calendar');
        }

        const data = await response.json();
        setBookings(data.map(normalizeBooking));
        setError('');
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [monthKey]);

  const goToPreviousMonth = () => {
    setCurrentMonth((previousMonth) => new Date(previousMonth.getFullYear(), previousMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth((previousMonth) => new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 1));
  };

  const handleDayClick = (cell) => {
    if (!cell || cell.booking) {
      return;
    }

    setMessage('');
    setError('');

    if (!startDate || (startDate && endDate)) {
      setStartDate(cell.key);
      setEndDate('');
      return;
    }

    if (cell.key < startDate) {
      setEndDate(startDate);
      setStartDate(cell.key);
      return;
    }

    setEndDate(cell.key);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!auth.authenticated) {
      window.location.assign(getAdminUrl('/login'));
      return;
    }

    if (!startDate || !endDate) {
      setError('Choose both a start and end date.');
      return;
    }

    if (selectedConflict) {
      setError('Those dates overlap with an existing booking.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setMessage('');

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate,
          blockDates,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to create booking');
      }

      setBookings((currentBookings) => [...currentBookings, normalizeBooking(data)].sort((a, b) => new Date(a.startDate) - new Date(b.startDate)));
      setMessage(blockDates ? 'Dates blocked for the property.' : 'Booking confirmed successfully.');
      setStartDate('');
      setEndDate('');
      setBlockDates(false);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      setError('');
      setMessage('');

      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to cancel booking');
      }

      setBookings((currentBookings) => currentBookings.filter((booking) => booking._id !== data._id));
      setMessage('Booking cancelled.');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section className="booking-section" aria-labelledby="booking-calendar-title">
      <div className="booking-shell">
        <div className="booking-intro">
          <div>
            <p className="booking-eyebrow">Stay planner</p>
            <h2 id="booking-calendar-title">Book your honeymoon dates</h2>
            <p className="booking-copy">
              Select a stay window, confirm availability, and manage reservations from one calendar.
              Administrators can also block dates for maintenance or internal holds.
            </p>
          </div>

          <div className="booking-auth-card">
            <p className="booking-auth-label">Account status</p>
            {auth.authenticated ? (
              <>
                <strong>{auth.user?.displayName || auth.user?.email}</strong>
                <span>{auth.user?.role === 'admin' ? 'Administrator access' : 'Guest booking access'}</span>
              </>
            ) : (
              <>
                <strong>Not signed in</strong>
                <span>Log in to book or cancel a stay.</span>
              </>
            )}
            {!auth.authenticated && (
              <div className="booking-auth-actions">
                <button type="button" className="booking-secondary-button" onClick={() => window.location.assign('/login')}>
                  Log in
                </button>
                <button type="button" className="booking-secondary-button" onClick={() => window.location.assign('/register')}>
                  Register
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="booking-layout">
          <div className="booking-card booking-calendar-card">
            <div className="calendar-header">
              <button type="button" className="calendar-nav-button" onClick={goToPreviousMonth} aria-label="Previous month">
                ←
              </button>
              <h3>{getMonthLabel(currentMonth)}</h3>
              <button type="button" className="calendar-nav-button" onClick={goToNextMonth} aria-label="Next month">
                →
              </button>
            </div>

            <div className="booking-legend" aria-label="Calendar legend">
              <span><i className="legend-dot available" />Available</span>
              <span><i className="legend-dot selected" />Selected</span>
              <span><i className="legend-dot booked" />Booked</span>
              <span><i className="legend-dot blocked" />Blocked</span>
            </div>

            {loading ? (
              <div className="booking-loading">Loading availability...</div>
            ) : error ? (
              <div className="booking-error">{error}</div>
            ) : (
              <div className="calendar-grid" role="grid" aria-label="Availability calendar">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((weekday) => (
                  <div key={weekday} className="calendar-weekday">{weekday}</div>
                ))}

                {monthCells.map((cell, index) => {
                  if (!cell) {
                    return <div key={`blank-${index}`} className="calendar-cell calendar-cell-empty" />;
                  }

                  const isSelected = startDate && endDate && cell.key >= startDate && cell.key <= endDate;
                  const bookingStatus = cell.booking?.status;
                  const bookingClass = bookingStatus === 'blocked' ? 'blocked' : bookingStatus === 'confirmed' ? 'booked' : '';

                  return (
                    <button
                      key={cell.key}
                      type="button"
                      className={`calendar-cell ${bookingClass} ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleDayClick(cell)}
                      disabled={Boolean(cell.booking)}
                      aria-pressed={isSelected}
                      title={cell.booking ? `${cell.booking.status === 'blocked' ? 'Blocked' : 'Booked'} date` : 'Available date'}
                    >
                      <span className="calendar-day-number">{cell.dayNumber}</span>
                      {cell.booking && <span className="calendar-day-note">{cell.booking.status === 'blocked' ? 'Blocked' : 'Booked'}</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="booking-sidebar">
            <div className="booking-card booking-form-card">
              <h3>Reserve this stay</h3>
              <form onSubmit={handleSubmit} className="booking-form">
                <label>
                  Start date
                  <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
                </label>

                <label>
                  End date
                  <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
                </label>

                {auth.user?.role === 'admin' && (
                  <label className="booking-checkbox-row">
                    <input type="checkbox" checked={blockDates} onChange={(event) => setBlockDates(event.target.checked)} />
                    Block these dates as administrator
                  </label>
                )}

                <div className="booking-form-summary">
                  <span>Selected nights</span>
                  <strong>{selectedNights || 'Choose a range'}</strong>
                </div>

                {selectedConflict && <div className="booking-warning">Selected dates overlap an existing reservation.</div>}
                {message && <div className="booking-success">{message}</div>}
                {error && <div className="booking-error">{error}</div>}

                <button type="submit" className="booking-primary-button" disabled={!auth.authenticated || submitting}>
                  {submitting ? 'Saving...' : auth.authenticated ? 'Confirm booking' : 'Log in to book'}
                </button>
              </form>
            </div>

            <div className="booking-card booking-list-card">
              <h3>Upcoming reservations</h3>
              <div className="booking-list">
                {activeBookings.length === 0 ? (
                  <p className="booking-empty">No reservations are on the calendar yet.</p>
                ) : (
                  activeBookings.map((booking) => {
                    const canCancel = auth.user && (auth.user.role === 'admin' || booking.bookedBy?.userId === auth.user.id);
                    const badgeClass = booking.status === 'blocked' ? 'blocked' : 'booked';

                    return (
                      <article key={booking._id} className="booking-item">
                        <div className="booking-item-topline">
                          <span className={`booking-badge ${badgeClass}`}>{booking.status === 'blocked' ? 'Blocked by admin' : 'Booked'}</span>
                          <strong>{formatRange(booking.startKey, booking.endKey)}</strong>
                        </div>
                        <p>{booking.guestName}</p>
                        <p>{booking.guestEmail}</p>
                        {booking.notes ? <p className="booking-note">{booking.notes}</p> : null}
                        {canCancel && (
                          <button type="button" className="booking-cancel-button" onClick={() => handleCancel(booking._id)}>
                            Cancel
                          </button>
                        )}
                      </article>
                    );
                  })
                )}
              </div>
            </div>

            {auth.user?.id && myBookings.length > 0 && (
              <div className="booking-card booking-list-card">
                <h3>My reservations</h3>
                <div className="booking-list">
                  {myBookings.map((booking) => (
                    <article key={booking._id} className="booking-item booking-item-own">
                      <div className="booking-item-topline">
                        <span className="booking-badge booked">Mine</span>
                        <strong>{formatRange(booking.startKey, booking.endKey)}</strong>
                      </div>
                      <p>{booking.propertyName}</p>
                      <button type="button" className="booking-cancel-button" onClick={() => handleCancel(booking._id)}>
                        Cancel my booking
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
