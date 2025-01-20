import React from 'react';
import "./Course.css";

const Course = () => {
  return (
    <div className="container">
      <div className="header">
        <img src="imgSource/back.png" alt="" style={{ height: '1.5rem' }} />
        <h3>Course</h3>
      </div>
      <div className="content">
        <div className="form-header">
          Today is Day 30
        </div>
        <div className="form-header">
          Do you want to
        </div>
        <div className="form-header">
          continue?
        </div>
        <div className="button-container">
          <button className="login-button">Continue</button>
        </div>
      </div>
    </div>
  );
};

export default Course;
