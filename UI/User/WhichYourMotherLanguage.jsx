import React from 'react';
import "./WhichYourMotherLanguage.css";

const WhichYourMotherLanguage = () => {
    return (
        <div className="container">
            <div className="header">
                <img src="imgSource/back.png" alt="" style={{ height: '1.5rem' }} />
                <h3>Conpleted 1/4</h3>
            </div>
            <div className="content">
                <div className="form-header">
                    What is Your Mother Language
                </div>
                <div className="input">
                    <button className="google-button">
                        <img src="./imgSource/US.png" alt="" style={{ position: 'relative', left: '-17rem' }} />
                        English
                    </button>
                    <button className="google-button">
                        <img src="./imgSource/Indonesia.webp" alt="" style={{ position: 'relative', left: '-17rem' }} />
                        Indonesian
                    </button>
                    <button className="google-button">
                        <img src="./imgSource/China.png" alt="" style={{ position: 'relative', left: '-17rem' }} />
                        Chinese
                    </button>
                    <div className="button-container">
                        <button className="login-button">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhichYourMotherLanguage;
