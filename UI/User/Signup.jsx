import React from 'react';
import "./Signup.css";

const Signup = () => {
    return (
        <div className="container">
            <div className="header">
                <img src="imgSource/back.png" alt="" style={{ height: '1.5rem' }} />
                <h3>Signup</h3>
            </div>
            <div className="content">
                <div className="form-header">
                    Create an Account
                </div>
                <div className="input">
                    <div className="input-group">
                        <span>First Name</span>
                        <input type="text" placeholder="First Name" />
                    </div>
                    <div className="input-group">
                        <span>Last Name</span>
                        <input type="text" placeholder="Last Name" />
                    </div>
                    <div className="input-group">
                        <span>Email Address</span>
                        <input type="text" placeholder="Email Address" />
                    </div>
                    <div className="button-container">
                        <button className="login-button">Signup</button>
                        <div className="or-text">
                            <span style={{ color: '#555555' }}> ------------------------------ Or ------------------------------ </span>
                        </div>
                        <button className="google-button">
                            <img src="./imgSource/google.png" alt="" />
                            Google
                        </button>
                    </div>
                    <div className="member">
                        Already you member? <span style={{ color: '#0a84ff', marginLeft: '0.5rem' }}>Login</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
