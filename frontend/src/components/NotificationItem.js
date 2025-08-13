import React from 'react';
import { deleteNotification } from '../services/api';

const NotificationItem = ({ notification, onAction, onMarkAsRead, onDelete }) => {
  const handleAction = async (action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/notifications/${notification._id}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        if (onAction) onAction(notification._id, action);
        // Refresh notifications after action
        window.location.reload();
      }
    } catch (error) {
      console.error('Error handling notification action:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        // First call the parent's onDelete to update UI immediately
        if (onDelete) onDelete(notification._id);
        
        // Then make the API call
        await deleteNotification(notification._id);
      } catch (error) {
        console.error('Error deleting notification:', error);
        alert('Failed to delete notification. Please try again.');
        
        // If API call fails, we might need to revert the UI change
        // But for now, we'll just show the error
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getButtonStyle = (style) => {
    const baseStyle = {
      padding: '4px 8px',
      margin: '2px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 'bold',
    };

    switch (style) {
      case 'primary':
        return { ...baseStyle, backgroundColor: '#007bff', color: 'white' };
      case 'danger':
        return { ...baseStyle, backgroundColor: '#dc3545', color: 'white' };
      case 'secondary':
        return { ...baseStyle, backgroundColor: '#6c757d', color: 'white' };
      default:
        return { ...baseStyle, backgroundColor: '#f8f9fa', color: '#333' };
    }
  };

  const getNotificationStyle = () => {
    const baseStyle = {
      padding: '12px',
      borderBottom: '1px solid #eee',
      backgroundColor: notification.isRead ? '#f8f9fa' : '#fff',
    };

    // Special styling for payment notifications
    if (notification.type === 'payment_success') {
      return {
        ...baseStyle,
        backgroundColor: notification.isRead ? '#e8f5e8' : '#f0fff0',
        borderLeft: '4px solid #28a745',
      };
    } else if (notification.type === 'payment_failed') {
      return {
        ...baseStyle,
        backgroundColor: notification.isRead ? '#fce8e6' : '#fff5f5',
        borderLeft: '4px solid #dc3545',
      };
    }

    return baseStyle;
  };

  return (
    <div style={getNotificationStyle()}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>
        {notification.title}
      </h4>
      <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666' }}>
        {notification.message}
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {notification.hasActions && notification.isActionable && notification.actions && (
            <div style={{ marginBottom: '8px' }}>
              {notification.actions.map((action, index) => (
                <button
                  key={index}
                  style={getButtonStyle(action.style)}
                  onClick={() => handleAction(action.action)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            marginLeft: '8px'
          }}
          onClick={handleDelete}
          title="Delete notification"
        >
          🗑️ Delete
        </button>
      </div>
      
      <div style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
        {formatDate(notification.createdAt)}
      </div>
    </div>
  );
};

export default NotificationItem;
