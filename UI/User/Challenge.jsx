import React from 'react';
import './Challenge.css';

const Challenge = () => {
  return (
    <div className="container">
      <div className="header">
        <img src="imgSource/back.png" alt="" style={{ height: '1.5rem' }} />
        <h3>Daily Challenge</h3>
      </div>
      <div className="content">
        <div className="form-header">
          Are you sure
        </div>
        <div className="form-header">
          you want to take the
        </div>
        <div className="form-header">
          Daily Challenge?
        </div>
        <div className="button-container">
          <button className="login-button">Continue</button>
        </div>
      </div>
    </div>
  );
};

export default Challenge;
