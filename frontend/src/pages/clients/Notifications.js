import React, { useEffect, useState } from 'react';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, deleteAllNotifications } from '../../services/api';
import NotificationItem from '../../components/NotificationItem';

const Notifications = () => {
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

  const handleAction = (notificationId, action) => {
    // Remove the notification from the list after action
    setNotifications((prev) =>
      prev.filter((notification) => notification._id !== notificationId)
    );
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all notifications?')) {
      try {
        await deleteAllNotifications();
        setNotifications([]);
      } catch (error) {
        console.error('Error deleting all notifications:', error);
      }
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>User Notifications</h1>
        {notifications.length > 0 && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              onClick={handleMarkAllAsRead}
            >
              Mark All as Read
            </button>
            <button
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              onClick={handleDeleteAll}
            >
              Delete All
            </button>
          </div>
        )}
      </div>
      {notifications.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No notifications available.</p>
      ) : (
        <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onAction={handleAction}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;