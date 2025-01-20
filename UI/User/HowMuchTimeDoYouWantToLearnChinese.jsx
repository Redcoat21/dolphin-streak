import React from 'react';
import "./HowMuchTimeDoYouWantToLearnChinese.css";

const HowMuchTimeDoYouWantToLearnChinese = () => {
    return (
        <div className="container">
            <div className="header">
                <img src="imgSource/back.png" alt="" style={{ height: '1.5rem' }} />
                <h3>Conpleted 2/4</h3>
            </div>
            <div className="content">
                <div className="form-header">
                    How much time do you want to learn Chinese
                </div>
                <div className="input">

                    <button className="google-button">
                        <img src="./imgSource/5Minutes.png" alt="" style={{ position: 'relative', left: '-17rem' }} />
                        5 Minutes / Day
                    </button>
                    <button className="google-button">
                        <img src="./imgSource/10Minutes.png" alt="" style={{ position: 'relative', left: '-17rem' }} />
                        10 Minutes / Day
                    </button>
                    <button className="google-button">
                        <img src="./imgSource/15Minutes.png" alt="" style={{ position: 'relative', left: '-17rem' }} />
                        15 Minutes / Day
                    </button>
                    <button className="google-button">
                        <img src="./imgSource/20Minutes.png" alt="" style={{ position: 'relative', left: '-17rem' }} />
                        20 Minutes / Day
                    </button>
                    <div className="button-container">
                        <button className="login-button">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowMuchTimeDoYouWantToLearnChinese;
