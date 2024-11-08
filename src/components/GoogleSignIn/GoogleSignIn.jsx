import React from 'react';
import './GoogleSignIn.css';

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
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          alt="Google sign-in" 
        />
      </div>
      <p className="btn-text">Sign in with Google</p>
    </button>
  );
};

export default GoogleSignIn;
