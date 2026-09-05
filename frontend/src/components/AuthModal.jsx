import React from 'react';
import { LoginPageView } from '../views/LoginPageView';

export const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{ 
          maxWidth: '920px', 
          width: '95%',
          padding: 0, 
          borderRadius: '12px', 
          overflow: 'hidden',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <LoginPageView 
          onLoginSuccess={(user) => {
            onLoginSuccess(user);
            onClose();
          }}
          isModal={true}
          onClose={onClose}
        />
      </div>
    </div>
  );
};
