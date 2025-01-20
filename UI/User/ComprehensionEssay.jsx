import React, { useState } from 'react';
import "./ComperhensionEssay";

const ComprehensionEssay = () => {
    const [wordCount, setWordCount] = useState(0);
    const [text, setText] = useState('');

    const handleTextChange = (event) => {
        setText(event.target.value);
        setWordCount(event.target.value.split(/\s+/).filter(word => word !== '').length);
    };

    return (
        <div>
            <div className="header">
                Comprehension
            </div>
            <div className="container">
                <div className="content">
                    <h2>Essay Topic: My Family</h2>
                    <div className="text-area-container">
                        <div className="word-count">{wordCount}/1000</div>
                        <textarea placeholder="我的家" onChange={handleTextChange} value={text}></textarea>
                    </div>
                    <button className="submit-button">Submit</button>
                </div>
            </div>
        </div>
    );
};

export default ComprehensionEssay;
