import React from 'react';
import "./Dashboard.css";

const Dashboard = () => {
    return (
        <div>
            <div className="header">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="user-icon">
                        <img src="./imgSource/User.png" alt="User Icon" />
                    </div>
                    <h3>Hello, User</h3>
                </div>
                <button className="forum-btn">Forum</button>
            </div>
            <div className="activity-container">
                <h2>Choose Your Activity</h2>
                <div className="activities">
                    <div className="activity">
                        <h3>Daily Challenge</h3>
                        <img src="./imgSource/daily.png" alt="Daily Challenge" />
                        <p>Put your knowledge to the test with our Daily Practice!</p>
                    </div>
                    <div className="activity">
                        <h3>Course</h3>
                        <img src="./imgSource/course.png" alt="Course" />
                        <p>Expand your knowledge with our interactive lessons!</p>
                    </div>
                    <div className="activity">
                        <h3>Comprehension</h3>
                        <img src="./imgSource/comprehension.png" alt="Comprehension" />
                        <p>Show off your skills with a comprehension test!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
