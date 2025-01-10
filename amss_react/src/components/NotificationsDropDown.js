import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

const NotificationsDropDown = () => {
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
     const auth = getAuth();
      const token = await auth.currentUser.getIdToken();

      const response = await fetch(`/api/notifications`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (!response.ok) {
              throw new Error('Failed to fetch notifications');
            }
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    // Fetch notifications as soon as the component is mounted
    fetchNotifications();
  },[]);

  const handleToggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`api/notifications/${notificationId}/mark-as-read`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={handleToggleDropdown}>
        Notifications ({notifications.length})
      </button>
      {dropdownOpen && (
        <div
          className="popup-dropdown"
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            width: '300px',
            zIndex: 1000,
          }}
        >
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="dropdown-item"
                  style={{
                    padding: '10px',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  <p style={{ margin: 0 , fontWeight: 'bold' }}>{notif.description}</p>
                  <p style={{ margin: 0 }}>Amount: {notif.amount} RON</p>
                  <small style={{ color: '#555' }}>Group: {notif.groupId}</small>
                  <button
                    onClick={() => markAsRead(notif.id)}
                    style={{
                      marginTop: '5px',
                      marginLeft:'5px',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '5px 10px',
                      cursor: 'pointer',
                    }}
                  >
                    Mark as Read
                  </button>
                </div>
              ))
            ) : (
              <div
                style={{
                  padding: '10px',
                  textAlign: 'center',
                  color: '#888',
                }}
              >
                No notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropDown;
