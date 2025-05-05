import React, { useState, useEffect } from 'react';
import NutritionistNavBar from './NutritionistNavBar';

const BookedProjects = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [newStartDate, setNewStartDate] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('You must be logged in to view bookings.');
          return;
        }

        const response = await fetch('http://localhost:5000/api/bookings/nutritionist', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data = await response.json();
        setBookings(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error.message);
        alert('Failed to fetch bookings. Please try again.');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleReschedule = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to reschedule a booking.');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/bookings/${selectedBookingId}/reschedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ startDate: newStartDate }),
      });

      if (!response.ok) {
        throw new Error('Failed to reschedule booking');
      }

      const updatedBooking = await response.json();

      // Update the booking's start date in the state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === selectedBookingId ? { ...booking, startDate: updatedBooking.startDate } : booking
        )
      );

      alert('Booking rescheduled successfully!');
      setIsRescheduleModalOpen(false);
      setSelectedBookingId(null);
      setNewStartDate('');
    } catch (error) {
      console.error('Failed to reschedule booking:', error.message);
      alert('Failed to reschedule booking. Please try again.');
    }
  };

  const handleSetActive = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to update the booking status.');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'active' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      const updatedBooking = await response.json();

      // Update the booking's status in the state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, status: 'active' } : booking
        )
      );

      alert('Booking status updated to active!');
    } catch (error) {
      console.error('Failed to update booking status:', error.message);
      alert('Failed to update booking status. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading bookings...</p>;
  }

  return (
    <>
      <NutritionistNavBar />
      <div style={styles.container}>
        <h1 style={styles.heading}>Bookings for Your Projects</h1>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking._id} style={styles.bookingCard}>
              <h3>Client: {booking.client?.name || 'N/A'}</h3>
              <p>Program: {booking.program?.name || 'N/A'}</p>
              <p>Description: {booking.program?.description || 'N/A'}</p>
              <p>Start Date: {booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'N/A'}</p>
              <p>Status: {booking.status}</p>
              {booking.status !== 'cancelled' && (
                <>
                  <button
                    onClick={() => {
                      setIsRescheduleModalOpen(true);
                      setSelectedBookingId(booking._id);
                    }}
                    style={styles.rescheduleButton}
                  >
                    Reschedule
                  </button>
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleSetActive(booking._id)}
                      style={styles.activeButton}
                    >
                      Set to Active
                    </button>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>

      {isRescheduleModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Reschedule Booking</h3>
            <input
              type="date"
              value={newStartDate}
              onChange={(e) => setNewStartDate(e.target.value)}
              style={styles.input}
            />
            <div style={styles.modalButtonContainer}>
              <button onClick={handleReschedule} style={styles.saveButton}>
                Save
              </button>
              <button
                onClick={() => {
                  setIsRescheduleModalOpen(false);
                  setSelectedBookingId(null);
                  setNewStartDate('');
                }}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#333',
  },
  bookingCard: {
    backgroundColor: '#fff',
    padding: '1rem',
    marginBottom: '1rem',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  rescheduleButton: {
    padding: '0.5rem 1rem',
    marginTop: '0.5rem',
    backgroundColor: 'rgb(0, 163, 158)',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  activeButton: {
    padding: '0.5rem 1rem',
    marginTop: '0.5rem',
    backgroundColor: 'rgb(0, 123, 255)',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '300px',
  },
  modalButtonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem',
  },
  saveButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgb(0, 107, 4)',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgb(112, 5, 5)',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default BookedProjects;