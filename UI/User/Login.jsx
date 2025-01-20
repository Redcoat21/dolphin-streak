import React from 'react';
import "./Login.css";

const Login = () => {
    return (
        <div className="container">
            <div className="header">
                <img src="imgSource/back.png" alt="" style={{ height: '1.5rem' }} />
                <h2>Login</h2>
            </div>
            <div className="content">
                <div className="icon">
                    <img src="imgSource/learnathome.png" alt="" style={{ height: '8rem' }} />
                    <h3>For free, join now and</h3>
                    <h3>start learning</h3>
                </div>
                <div className="input">
                    <div className="input-group">
                        <span>Email Address</span>
                        <input type="text" />
                    </div>
                    <div className="input-group">
                        <span>Password</span>
                        <input type="password" />
                    </div>
                    <div className="forgotpassword">
                        <span style={{ fontSize: 'xx-small', color: '#9e9e9e' }}>
                            Forgot Password
                        </span>
                    </div>
                    <div className="button-container">
                        <button className="login-button">Login</button>
                        <div className="or-text">
                            <span style={{ color: '#555555' }}> ------------------------------ Or ------------------------------ </span>
                        </div>
                        <button className="google-button">
                            <img src="./imgSource/google.png" alt="" />
                            Google
                        </button>
                    </div>
                    <div className="member">
                        Now you member? <span style={{ color: '#0a84ff', marginLeft: '0.5rem' }}>Signup</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
