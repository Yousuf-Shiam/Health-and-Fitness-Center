import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Correct import for jwt-decode
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, deleteAllNotifications } from '../../services/api';
import NotificationItem from '../../components/NotificationItem';

function TrainerNavBar() {
  const [trainerName, setTrainerName] = useState(''); // State to hold trainer name
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainerName = async () => {
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
          throw new Error('Failed to fetch trainer name');
        }

        const data = await response.json();
        setTrainerName(data.name); // Set the trainer's name
      } catch (error) {
        console.error('Error fetching trainer name:', error);
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

    fetchTrainerName();
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

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all notifications? This action cannot be undone.')) {
      try {
        await deleteAllNotifications();
        setNotifications([]);
        setUnreadCount(0);
      } catch (error) {
        console.error('Error deleting all notifications:', error);
      }
    }
  };

  const handleDelete = (notificationId) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification._id !== notificationId)
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleAction = (notificationId, action) => {
    // Remove the notification from the list after action and refresh data
    setNotifications((prev) =>
      prev.filter((notification) => notification._id !== notificationId)
    );
    setShowDropdown(false);
    // Refresh notifications after a short delay
    setTimeout(() => {
      fetchNotifications();
    }, 1000);
  };

  const firstLetter = trainerName.charAt(0).toUpperCase();

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
    title: {
      textDecoration: 'none',
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: '1.5rem',
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
      minWidth: '20px',
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
        <Link to="/trainer-home" style={styles.title}>
          Health & Fitness
        </Link>
        <div style={styles.rightContainer}>
          <div style={styles.notificationContainer}>
            <div style={styles.bellIcon} onClick={() => setShowDropdown(!showDropdown)}>
              🔔
              {unreadCount > 0 && (
                <span style={styles.unreadBadge}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
            {showDropdown && (
              <div style={styles.dropdown}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0 }}>Training Notifications</h3>
                  {notifications.length > 0 && (
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        style={{
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px'
                        }}
                        onClick={handleMarkAllAsRead}
                      >
                        Mark All Read
                      </button>
                      <button
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px'
                        }}
                        onClick={handleDeleteAll}
                      >
                        Delete All
                      </button>
                    </div>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <p>No training notifications available.</p>
                ) : (
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {notifications.slice(0, 3).map((notification) => (
                      <NotificationItem
                        key={notification._id}
                        notification={notification}
                        onAction={handleAction}
                        onMarkAsRead={handleMarkAsRead}
                        onDelete={handleDelete}
                      />
                    ))}
                    {notifications.length > 3 && (
                      <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <button
                          style={{
                            backgroundColor: '#0f5132',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            setShowDropdown(false);
                            navigate('/trainer-notifications');
                          }}
                        >
                          View All Notifications
                        </button>
                      </div>
                    )}
                  </div>
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
        <h2>Welcome, {trainerName}!</h2> {/* Display the trainer name */}
        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          onClick={() => navigate('/trainer-profile')}
        >
          Profile
        </button>
        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          onClick={() => navigate('/trainer-notifications')}
        >
          Notifications
        </button>
        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          onClick={() => navigate('/trainer-create-program')}
        >
          Create Program
        </button>
        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          onClick={() => navigate('/trainer-booked-trainings')}
        >
          Booked Trainings
        </button>
        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </>
  );
}

export default TrainerNavBar;