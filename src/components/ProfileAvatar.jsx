import { useState, useEffect } from 'react';
import '../styles/ProfileAvatar.css';

const ProfileAvatar = ({ 
  name = '', 
  imageUrl = '', 
  size = 'medium',
  status = 'offline',
  onClick
}) => {
  const [initials, setInitials] = useState('');
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Generate initials from name
    const nameInitials = name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
    setInitials(nameInitials);
  }, [name]);

  const sizeClasses = {
    small: 'avatar-sm',
    medium: 'avatar-md',
    large: 'avatar-lg'
  };

  const statusClasses = {
    online: 'status-online',
    offline: 'status-offline',
    away: 'status-away',
    busy: 'status-busy'
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getRandomColor = () => {
    const colors = [
      'var(--primary-color)',
      'var(--secondary-color)',
      'var(--accent-color)',
      '#34D399',
      '#60A5FA',
      '#A78BFA'
    ];
    // Use name string to generate consistent color for same user
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div 
      className={`avatar-container ${sizeClasses[size]}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {(!imageUrl || imageError) ? (
        <div 
          className="avatar-initials"
          style={{ 
            backgroundColor: getRandomColor(),
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        >
          {initials || '?'}
          <div className="avatar-ring"></div>
        </div>
      ) : (
        <div className="avatar-image-container">
          <img
            src={imageUrl}
            alt={name}
            className="avatar-image"
            onError={handleImageError}
            style={{ 
              transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }}
          />
          <div className="avatar-ring"></div>
        </div>
      )}
      {status && (
        <span className={`avatar-status ${statusClasses[status]}`}></span>
      )}
    </div>
  );
};

export default ProfileAvatar; 