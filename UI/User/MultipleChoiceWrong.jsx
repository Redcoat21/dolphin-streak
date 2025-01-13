import React from 'react';
import ".MultipleChoiceWrong.css";

const MultipleChoiceWrong = () => {
    return (
        <div>
            <div className="header">Course 10 - Chapter 6/10</div>
            <div className="question">How do you say "thank you" in Mandarin?</div>
            <div className="options-container">
                <div className="wrong">你好</div>
                <div className="option">谢谢</div>
                <div className="option">再见</div>
                <div className="option">对不起</div>
            </div>
            <button className="continue-button">Continue</button>
        </div>
    );
};

export default MultipleChoiceWrong;
