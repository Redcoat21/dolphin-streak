import React from 'react';
import "./ForgotPassword.css";

const ForgotPassword = () => {
  return (
    <div className="container">
      <div className="header">
        <img src="imgSource/back.png" alt="" style={{ height: '1.5rem' }} />
        <h3>Forgot Password</h3>
      </div>
      <div className="content">
        <div className="form-header">
          Please enter your email address
        </div>
        <div className="input">
          <div className="input-group">
            <span>Email Address</span>
            <input type="text" placeholder="Email Address" />
          </div>
          <div className="button-container">
            <button className="login-button">Send Reset Link</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
