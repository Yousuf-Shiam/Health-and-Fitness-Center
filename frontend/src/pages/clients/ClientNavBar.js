import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
import { Link } from 'react-router-dom';
import { getNotifications, markNotificationAsRead } from '../../services/api';

function ClientNavBar() {
  const [clientName, setClientName] = useState(''); // State to hold client name
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
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
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/${decoded.id}`, {
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

    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
        const unread = data.filter((notification) => !notification.isRead).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchClientName();
    fetchNotifications();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/login'); // Redirect to login page
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId ? { ...notification, isRead: true } : notification
        )
      );
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
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
    notificationIcon: {
      color: '#ffffff',
      textDecoration: 'none',
      fontSize: '1rem',
    },
    notificationContainer: {
      position: 'relative',
    },
    bellIcon: {
      cursor: 'pointer',
      position: 'relative',
    },
    unreadBadge: {
      position: 'absolute',
      top: '-5px',
      right: '-10px',
      backgroundColor: 'red',
      color: 'white',
      borderRadius: '50%',
      padding: '0.2rem 0.5rem',
      fontSize: '0.8rem',
      fontWeight: 'bold',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: '20px', // Ensure the badge is circular even for single-digit numbers
      height: '20px',
    },
    dropdown: {
      position: 'absolute',
      top: '2rem',
      right: '0',
      backgroundColor: '#ffffff',
      color: '#000000',
      border: '1px solid #ccc',
      borderRadius: '8px',
      width: '300px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      padding: '1rem',
    },
    notification: {
      marginBottom: '1rem',
      padding: '0.5rem',
      borderBottom: '1px solid #ccc',
    },
    rightContainer: {
      display: 'flex',
      alignItems: 'center',
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
        <div style={styles.rightContainer}>
          <div style={styles.notificationContainer}>
            <div style={styles.bellIcon} onClick={() => setShowDropdown(!showDropdown)}>
              🔔
              {unreadCount > 0 && (
                <span style={styles.unreadBadge}>
                  {unreadCount > 99 ? '99+' : unreadCount} {/* Show "99+" if count exceeds 99 */}
                </span>
              )}
            </div>
            {showDropdown && (
              <div style={styles.dropdown}>
                <h3>User Notifications</h3>
                {notifications.length === 0 ? (
                  <p>No notifications available.</p>
                ) : (
                  notifications.map((notification) => (
                    <div key={notification._id} style={styles.notification}>
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <small>{new Date(notification.createdAt).toLocaleString()}</small>
                      {!notification.isRead && (
                        <button onClick={() => handleMarkAsRead(notification._id)}>Mark as Read</button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div
            style={styles.avatar}
            onClick={toggleSidebar}
            title="Open Sidebar"
          >
            {firstLetter}
          </div>
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