import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode to decode the token

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

  if (loading) {
    return <p>Loading bookings...</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>All Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((bookings) => (
          <div key={bookings._id} style={styles.bookingCard}>
          <h3>Program: {bookings.program?.name || 'N/A'}</h3>
          <p>Description: {bookings.program?.description || 'N/A'}</p>
          <p>Duration: {bookings.program?.duration || 'N/A'} weeks</p>
          <p>Price: ${bookings.program?.price || 'N/A'}</p>
          <p>Client: {bookings.client?.name || 'N/A'}</p>
          <p>Status: {bookings.status}</p>
        </div>
        ))
      )}
    </div>
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
};

export default BookedPrograms;