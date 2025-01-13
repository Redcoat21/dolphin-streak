import React from 'react';
import "./FillInTheBlank.css";

const FillInTheBlank = () => {
    return (
        <div>
            <div className="header">Course 10 - Chapter 7/10</div>
            <div className="question-container">
                我叫小明，今年 ___ 岁。
                <span>Wǒ jiào Xiǎomíng, jīnnián ___ suì.</span>
            </div>
            <div className="options-container">
                <div className="option">二十</div>
                <div className="option">三十</div>
                <div className="option">二十五</div>
                <div className="option">四十</div>
            </div>
            <button className="continue-button">Continue</button>
        </div>
    );
};

export default FillInTheBlank;
