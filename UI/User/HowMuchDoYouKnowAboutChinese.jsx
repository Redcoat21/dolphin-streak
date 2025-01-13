import React from 'react';
import "./HowMuchDoYouKnowAboutChinese.css"

const HowMuchDoYouKnowAboutChinese = () => {
    return (
        <div className="container">
            <div className="header">
                <img src="imgSource/back.png" alt="" style={{ height: '1.5rem' }} />
                <h3>Conpleted 2/4</h3>
            </div>
            <div className="content">
                <div className="form-header">
                    How much do you know about Chinese
                </div>
                <div className="input">

                    <button className="google-button">
                        I am a Beginner. I am just Starting Out
                    </button>
                    <button className="google-button">
                        I have some Intermediate Experience with Chonese
                    </button>
                    <button className="google-button">
                        I am Profficient with the Chinese Language
                    </button>
                    <div className="button-container">
                        <button className="login-button">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowMuchDoYouKnowAboutChinese;
