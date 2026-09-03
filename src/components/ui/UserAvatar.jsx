import React, { useState } from 'react';
import { User } from 'lucide-react';

export const UserAvatar = ({
  user,
  photoURL,
  displayName,
  size = 34,
  className = ''
}) => {
  const [imgError, setImgError] = useState(false);

  const url = photoURL || user?.photoURL;
  const name = displayName || user?.displayName || user?.email || 'U';
  const initial = name ? name.charAt(0).toUpperCase() : 'U';

  if (url && !imgError) {
    return (
      <img
        src={url}
        alt={name}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={() => setImgError(true)}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '1.5 solid var(--accent-primary)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          flexShrink: 0
        }}
        className={className}
      />
    );
  }

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--accent-primary) 0%, #7C3AED 100%)',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: `${Math.round(size * 0.45)}px`,
        boxShadow: '0 2px 8px rgba(91, 141, 239, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        flexShrink: 0,
        textTransform: 'uppercase'
      }}
      title={name}
      className={className}
    >
      {initial !== 'U' ? initial : <User size={Math.round(size * 0.55)} />}
    </div>
  );
};
