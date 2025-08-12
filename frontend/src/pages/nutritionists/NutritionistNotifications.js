import React, { useEffect, useState } from 'react';
import { getNotifications, markNotificationAsRead } from '../../services/api';

const NutritionistNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId ? { ...notification, isRead: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div>
      <h1>Notifications</h1>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        notifications.map((notification) => (
          <div key={notification._id} style={styles.notification}>
            <h3>{notification.title}</h3>
            <p>{notification.message}</p>
            <small>{new Date(notification.createdAt).toLocaleString()}</small>
            {!notification.isRead && (
              <button onClick={() => handleMarkAsRead(notification._id)}>Mark as Read</button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  notification: {
    padding: '1rem',
    marginBottom: '1rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
};

export default NutritionistNotifications;
