import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode to decode the token
import { deleteBooking } from '../../services/api';
import ClientNavBar from './ClientNavBar';

const BookedPrograms = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // State to store decoded user information

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        if (!token) {
          console.error('No token found');
          return;
        }

        // Decode the token to get user information
        const decoded = jwtDecode(token);
        setUser(decoded); // Store the decoded user information in state

        // Fetch all bookings from the backend
        const response = await fetch('http://localhost:5000/api/bookings', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data = await response.json(); // Parse the JSON response
        setBookings(data); // Set the bookings in state
      } catch (error) {
        console.error('Failed to fetch bookings:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);


  const handleCancelBooking = async (bookingId, newStatus) => {
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
        body: JSON.stringify({ status: newStatus }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }
  
      const updatedBooking = await response.json();
  
      // Update the booking's status in the state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
  
      alert('Booking canceled successfully!');
    } catch (error) {
      console.error('Failed to update booking status:', error.message);
      alert('Failed to update booking status. Please try again.');
    }
  };

  
  const handleUpdateStatus = async (bookingId, newStatus) => {
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
        body: JSON.stringify({ status: newStatus }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }
  
      const updatedBooking = await response.json();
  
      // Update the booking's status in the state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
  
      alert('Booking status updated successfully!');
    } catch (error) {
      console.error('Failed to update booking status:', error.message);
      alert('Failed to update booking status. Please try again.');
    }
  };


  const handleDeleteBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to delete a booking.');
        return;
      }
    
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log('Response:', response); // Debugging
  
      if (!response.ok) {
        throw new Error('Failed to delete booking');
      }
  
      // Remove the deleted booking from the state
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      );

      alert('Booking deleted successfully!');
    } catch (error) {
      console.error('Failed to delete booking:', error.message);
      alert(`Failed to delete booking. Please try again. : ${bookingId} zxx ${error.message}`);
    }
  };
  
  const handleRebook = async (bookingId, newStatus) => {
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
        body: JSON.stringify({ status: newStatus }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }
  
      const updatedBooking = await response.json();
  
      // Update the booking's status in the state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
  
      alert('Rebooked successfully!');
    } catch (error) {
      console.error('Failed to update booking status:', error.message);
      alert('Failed to update booking status. Please try again.');
    }
  };

  const handlePayment = (bookingId) => {
    alert(`Redirecting to payment for booking ID: ${bookingId}`);
    // Add logic to integrate with a payment gateway here
  };

  if (loading) {
    return <p>Loading bookings...</p>;
  }



  return (
    <>
      <ClientNavBar user={user} /> {/* Pass the user information to the navbar */}
    <div style={styles.container}>
      <h1 style={styles.heading}>All Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} style={styles.bookingCard}>
            <h3>Program: {booking.program?.name || 'N/A'}</h3>

            <p>
                {booking.program?.creator?.role === "trainer" ? (
                  <>
                  <p>Trainer: {booking.program?.creator?.name}</p>
                  </>
                ) : booking.program?.creator?.role === "nutritionist" ? (
                  
                  <p>Nutritionist: {booking.program?.creator?.name}</p>
                ) : null}
            </p>
            <p>Description: {booking.program?.description || 'N/A'}</p>
            <p>Duration: {booking.program?.duration || 'N/A'} weeks</p>
            <p>Price: ${booking.program?.price || 'N/A'}</p>
            <p>Starting Date: {booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'N/A'}</p>
            <p>Status: {booking.status}</p>
            {booking.status === 'cancelled' ? (
              <>
                <button
                  onClick={() => handleDeleteBooking(booking._id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
                <button
                  onClick={() => handleRebook(booking._id, 'pending')}
                  style={styles.rebookButton}
                >
                  Rebook
                </button>
              </>
            ) : booking.status === 'confirmed' ? (
              <>
                <button
                  onClick={() => handlePayment(booking._id)}
                  style={styles.paymentButton}
                >
                  Pay Now
                </button>

                <button
                  onClick={() => handleUpdateStatus(booking._id, 'pending')}
                  style={styles.updateButton}
                >
                  Go Back
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleCancelBooking(booking._id, 'cancelled')}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                  style={styles.updateButton}
                >
                  Confirm
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
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
    fontSize: '2rem',
    marginBottom: '1.5rem',
    color: '#333',
  },
  userInfo: {
    marginBottom: '2rem',
    padding: '1rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  bookingCard: {
    padding: '1rem',
    marginBottom: '1rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  cancelButton: {
    padding: '0.5rem 1rem',
    marginTop: '0.5rem',
    backgroundColor: 'rgb(112, 5, 5)',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  updateButton: {
    padding: '0.5rem 1rem',
    marginTop: '0.5rem',
    marginLeft: '0.5rem',
    backgroundColor: 'rgb(0, 107, 4)',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    marginTop: '0.5rem',
    backgroundColor: 'rgb(45, 0, 0)',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  rebookButton: {
    padding: '0.5rem 1rem',
    marginTop: '0.5rem',
    marginLeft: '0.5rem',
    backgroundColor: 'rgb(1, 63, 28)',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  paymentButton: {
    padding: '0.5rem 1rem',
    marginTop: '0.5rem',
    backgroundColor: 'rgb(0, 44, 92)',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default BookedPrograms;