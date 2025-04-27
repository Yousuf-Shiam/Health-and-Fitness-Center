import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
import { Link } from 'react-router-dom';


function ClientNavBar() {
  const [clientName, setClientName] = useState(''); // State to hold client name
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/login'); // Redirect to login page
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const firstLetter = clientName.charAt(0).toUpperCase();

  const styles = {
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      background: 'linear-gradient(90deg, #0f5132, #0d3a7d)', // Match Navbar.js color scheme
      color: '#ffffff',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)', // Slight shadow for depth
        position: 'sticky',
        top: 0,
        margin: '0',
    },
    logo: {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        color: '#ffffff', // White text for the logo
        textDecoration: 'none',
        transition: 'color 0.3s ease',
      },
      logoHover: {
        color: '#ffcc00', // Bright yellow on hover
      },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#ffffff',
      color: '#0f5132',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
    sidebar: {
      position: 'fixed',
      top: 0,
      right: sidebarVisible ? 0 : '-100%', // Slide in/out from the right
      width: '250px',
      height: '100%',
      background: 'linear-gradient(90deg, #0f5132, #0d3a7d)', // Match Navbar.js color scheme
      color: '#ffffff',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      transition: 'right 0.3s ease', // Smooth slide-in effect
      boxShadow: '-4px 0 6px rgba(0, 0, 0, 0.2)', // Shadow on the left side of the sidebar
    },
    button: {
      backgroundColor: '#ffffff',
      color: '#0f5132',
      border: 'none',
      padding: '0.8rem 1rem',
      margin: '0.5rem 0',
      borderRadius: '4px',
      cursor: 'pointer',
      width: '100%',
      textAlign: 'left',
    },
    buttonHover: {
      backgroundColor: '#d4edda',
    },
    closeButton: {
      alignSelf: 'flex-end',
      backgroundColor: '#ffffff',
      color: '#0f5132',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
  };

  return (
    <>
      {/* Navbar */}
      <div style={styles.navbar}>
      <div>
          <Link
            to="/client-home"
            style={styles.logo}
            onMouseOver={(e) => (e.target.style.color = styles.logoHover.color)}
            onMouseOut={(e) => (e.target.style.color = styles.logo.color)}
          >
            Health & Fitness
          </Link>
        </div>
        <div
          style={styles.avatar}
          onClick={toggleSidebar}
          title="Open Sidebar"
        >
          {firstLetter}
        </div>
      </div>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <button
          style={styles.closeButton}
          onClick={toggleSidebar}
        >
          Close
        </button>
        <h2>Welcome, {clientName}!</h2> {/* Display the client name */}
        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          onClick={() => navigate('/profile')}
        >
          Profile
        </button>
        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          onClick={() => navigate('/booked-programs')}
        >
          Booked Programs
        </button>
        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          onClick={() => navigate('/mealplans')} // Navigate to Meal Plans page
        >
          Meal Plans
        </button>
...
        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          onClick={handleLogout}
        >
          Logout
        </button>
        {/* Add more options here */}
      </div>
    </>
  );
}

export default ClientNavBar;