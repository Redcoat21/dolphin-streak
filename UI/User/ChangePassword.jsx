import React from 'react';
import "./ChangePassword.css";
const ChangePassword = () => {
  return (
    <div className="container">
      <div className="header">
        <img src="imgSource/back.png" alt="" style={{ height: '1.5rem' }} />
        <h3>Change Password</h3>
      </div>
      <div className="content">
        <div className="form-header">
          Choose a Password
        </div>
        <div className="input">
          <div className="input-group">
            <span>Password</span>
            <input type="password" placeholder="Password" />
          </div>
          <div className="input-group">
            <span>Confirm Password</span>
            <input type="password" placeholder="Confirm Password" />
          </div>
          <div className="button-container">
            <button className="login-button">Confirm Password Change</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
