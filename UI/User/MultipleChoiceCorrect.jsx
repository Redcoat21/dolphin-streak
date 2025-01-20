import React from 'react';
import "./MultipleChoiceCorrect.css"

const MultipleChoiceCorrect = () => {
    return (
        <div>
            <div className="header">Course 10 - Chapter 6/10</div>
            <div className="question">How do you say "thank you" in Mandarin?</div>
            <div className="options-container">
                <div className="option">你好</div>
                <div className="correct">谢谢</div>
                <div className="option">再见</div>
                <div className="option">对不起</div>
            </div>
            <button className="continue-button">Continue</button>
        </div>
    );
};

export default MultipleChoiceCorrect;
