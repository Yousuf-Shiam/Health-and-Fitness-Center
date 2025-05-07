import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

function AdminNavBar() {
  const [adminName, setAdminName] = useState(''); // State to hold admin name
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminName = async () => {
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
          throw new Error('Failed to fetch admin name');
        }

        const data = await response.json();
        setAdminName(data.name); // Set the admin's name
      } catch (error) {
        console.error('Error fetching admin name:', error);
      }
    };

    fetchAdminName();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/admin-login'); // Redirect to admin login page
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const firstLetter = adminName.charAt(0).toUpperCase();

  const styles = {
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      background: 'linear-gradient(90deg, #0f5132, #0d3a7d)',
      color: '#ffffff',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
      position: 'sticky',
      top: 0,
      margin: '0',
    },
    logo: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: '#ffffff',
      textDecoration: 'none',
      transition: 'color 0.3s ease',
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
      right: sidebarVisible ? 0 : '-100%',
      width: '250px',
      height: '100%',
      background: 'linear-gradient(90deg, #0f5132, #0d3a7d)',
      color: '#ffffff',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      transition: 'right 0.3s ease',
      boxShadow: '-4px 0 6px rgba(0, 0, 0, 0.2)',
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
          <span style={styles.logo}>Admin Dashboard</span>
        </div>
        <div style={styles.avatar} onClick={toggleSidebar} title="Open Sidebar">
          {firstLetter}
        </div>
      </div>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <button style={styles.closeButton} onClick={toggleSidebar}>
          Close
        </button>
        <h2>Welcome, {adminName}!</h2> {/* Display the admin name */}
        <button
          style={styles.button}
          onClick={() => navigate('/admin')}
        >
          Dashboard
        </button>
        <button
          style={styles.button}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </>
  );
}

export default AdminNavBar;