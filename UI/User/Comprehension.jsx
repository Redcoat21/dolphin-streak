import React from 'react';
import "./Comperhension.css";

const Comperhension = () => {
  return (
    <div className="container">
      <div className="header">
        <img src="imgSource/back.png" alt="" style={{ height: '1.5rem' }} />
        <h3>Course</h3>
      </div>
      <div className="content">
        <div className="form-header">
          Are you sure
        </div>
        <div className="form-header">
          you want
        </div>
        <div className="form-header">
          to take the
        </div>
        <div className="form-header">
          Comprehension
        </div>
        <div className="form-header">
          Assignment?
        </div>
        <div className="button-container">
          <button className="login-button">Continue</button>
        </div>
      </div>
    </div>
  );
};

export default Comperhension;
