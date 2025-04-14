import React, { useEffect, useState } from 'react';
import ClientNavBar from './ClientNavBar'; // Import the ClientNavBar component
import Footer from '../../components/Footer';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode to decode the token

function ClientHomePage() {
  const [clientName, setClientName] = useState(''); // State to store the client's name

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'linear-gradient(90deg, #e6e6fa, #add8e6)',
      color: '#333333',
      margin: 0,
      padding: 0,
      overflowY: 'auto',
      overflowX: 'hidden', // Prevent horizontal scrolling
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      width: '100%', // Ensure content does not exceed container width
    },
    heading: {
      fontSize: '2.8rem',
      fontWeight: 'bold',
      color: 'rgb(10, 53, 99)', // Vibrant blue for the heading
      marginBottom: '1rem',
    },
    subheading: {
      fontSize: '1.4rem',
      color: '#555555', // Medium gray for the subheading
      marginBottom: '2rem',
    },
    button: {
      padding: '0.8rem 2rem',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#ffffff', // White text for the button
      backgroundColor: 'rgb(20, 97, 99)', // Vibrant blue button
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#0056b3', // Darker blue on hover
    },
  };

  // Fetch client name from the backend
  useEffect(() => {
    const fetchClientName = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        // Decode the token to get the user ID
        const decoded = jwtDecode(token);

        // Fetch user details using the ID from the decoded token
        const response = await fetch(`http://localhost:5000/api/users/${decoded.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch client name');
        }

        const data = await response.json();
        setClientName(data.name); // Set the client's name
      } catch (error) {
        console.error('Error fetching client name:', error);
      }
    };

    fetchClientName();
  }, []);

  // Ensure no white borders by applying global styles
  React.useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflowY = 'auto'; // Allow scrolling
    document.body.style.overflowX = 'hidden'; // Prevent horizontal scrolling
  }, []);

  return (
    <>
      <div style={styles.container}>
        <ClientNavBar /> {/* Add the ClientNavBar at the top */}
        <div style={styles.content}>
          <h1 style={styles.heading}>Welcome, {clientName}!</h1> {/* Display the client's name */}
          <p style={styles.subheading}>
            Manage your fitness activities, track progress, and achieve your goals.
          </p>
          <button
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          >
            Explore Activities
          </button>
        </div>
      </div>
      <Footer /> {/* Add the Footer at the bottom */}
    </>
  );
}

export default ClientHomePage;