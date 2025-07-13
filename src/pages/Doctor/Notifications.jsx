import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaEnvelope, FaBell, FaCheck, FaSearch, FaFilter, FaTrash } from 'react-icons/fa';
import Layout from '../../components/Layout';
import '../../styles/Doctor/Notifications.css';

function Notifications() {
  // Add a side effect to hide the sidebar and adjust layout when this page loads
  useEffect(() => {
    // Add full-screen class to the main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.classList.add('full-screen-content');
      mainContent.classList.add('expanded');
    }
    
    // Hide the sidebar completely
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.style.display = 'none';
    }
    
    // Hide the top navbar for full screen experience
    const navbar = document.querySelector('.top-navbar');
    if (navbar) {
      navbar.style.display = 'none';
    }
    
    return () => {
      // Cleanup effect when component unmounts
      if (sidebar) {
        sidebar.style.display = '';
      }
      
      if (mainContent) {
        mainContent.classList.remove('full-screen-content');
        mainContent.classList.remove('expanded');
      }
      
      if (navbar) {
        navbar.style.display = '';
      }
    };
  }, []);
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'appointment',
      text: 'Your appointment with Dr. Smith has been confirmed.',
      time: '2 hours ago',
      read: false,
      icon: <FaCalendarAlt />
    },
    {
      id: 2,
      type: 'message',
      text: 'You have a new message from Dr. Johnson regarding your test results.',
      time: 'Yesterday',
      read: false,
      icon: <FaEnvelope />
    },
    {
      id: 3,
      type: 'reminder',
      text: 'Reminder: Your follow-up appointment is scheduled for tomorrow.',
      time: '2 days ago',
      read: false,
      icon: <FaBell />
    },
    {
      id: 4,
      type: 'appointment',
      text: 'Appointment with Dr. Williams has been rescheduled to next Monday.',
      time: '3 days ago',
      read: true,
      icon: <FaCalendarAlt />
    },
    {
      id: 5,
      type: 'message',
      text: 'New lab results uploaded to your patient portal.',
      time: '1 week ago',
      read: true,
      icon: <FaEnvelope />
    }
  ]);
  
  const [filter, setFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };
  
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  const getFilteredNotifications = () => {
    return notifications.filter(notification => {
      // Filter by type
      const typeMatch = filter === 'all' || notification.type === filter;
      
      // Filter by search text
      const searchMatch = !searchText || 
        notification.text.toLowerCase().includes(searchText.toLowerCase());
        
      return typeMatch && searchMatch;
    });
  };
  
  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <Layout>
      <div className="notifications-page">
        <div className="notifications-header">
          <h1>Notifications</h1>
          <div className="notification-actions">
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="secondary-button">
                Mark all as read
              </button>
            )}
            {notifications.length > 0 && (
              <button onClick={clearAllNotifications} className="danger-button">
                Clear all
              </button>
            )}
          </div>
        </div>
        
        <div className="notification-filters">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          
          <div className="filter-options">
            <span className="filter-label"><FaFilter /> Filter:</span>
            <button 
              className={`filter-button ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-button ${filter === 'appointment' ? 'active' : ''}`}
              onClick={() => setFilter('appointment')}
            >
              Appointments
            </button>
            <button 
              className={`filter-button ${filter === 'message' ? 'active' : ''}`}
              onClick={() => setFilter('message')}
            >
              Messages
            </button>
            <button 
              className={`filter-button ${filter === 'reminder' ? 'active' : ''}`}
              onClick={() => setFilter('reminder')}
            >
              Reminders
            </button>
          </div>
        </div>
        
        <div className="notifications-list">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className={`notification-icon-container ${notification.type}`}>
                  {notification.icon}
                </div>
                <div className="notification-details">
                  <p className="notification-text">{notification.text}</p>
                  <span className="notification-time">{notification.time}</span>
                </div>
                <button 
                  className="delete-notification" 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                  title="Delete notification"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          ) : (
            <div className="no-notifications">
              <FaCheck size={48} />
              <h2>You're all caught up!</h2>
              <p>No notifications to display</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Notifications;
