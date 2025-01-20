import React from 'react';
import "./VoiceSucess.css";

const VoiceSucess = () => {
    return (
        <div>
            <div className="header">Course 10 - Chapter 9/10</div>
            <div className="subtitle">
                我叫小明，今年二十岁。
                <span>Wǒ jiào Xiǎomíng, jīnnián èrshí suì.</span>
            </div>
            <div className="mic-container">
                <img src="./imgSource/mic.png" alt="Mic" />
            </div>
            <button className="continue-button">Continue</button>
        </div>
    );
};

export default VoiceSucess;
