import React from 'react';
import './GoogleSignIn.css';
import googleLogo from './google-g-logo.svg';

const GoogleSignIn = () => {
  const handleGoogleSignIn = () => {
    window.location.href = 'https://master.smart-brain-api.c66.me/auth/google';
  };

  return (
    <button 
      onClick={handleGoogleSignIn}
      className="google-btn"
    >
      <div className="google-icon-wrapper">
        <img 
          className="google-icon" 
          src={googleLogo}
          alt="Google sign-in" 
        />
      </div>
      <p className="btn-text">Sign in with Google</p>
    </button>
  );
};

export default GoogleSignIn;
