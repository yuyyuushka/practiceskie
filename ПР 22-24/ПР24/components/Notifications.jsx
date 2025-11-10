import React from 'react';

const Notifications = ({ error, success, onDismiss }) => {
  if (!error && !success) return null;

  return (
    <div className="notifications">
      {error && (
        <div className="notification error">
          <span>{error}</span>
          <button onClick={() => onDismiss('error')} className="close-btn">
            ×
          </button>
        </div>
      )}
      {success && (
        <div className="notification success">
          <span>{success}</span>
          <button onClick={() => onDismiss('success')} className="close-btn">
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;