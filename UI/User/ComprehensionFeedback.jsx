import React from 'react';
import "./ComprehensionFeedback.css"

const ComprehensionFeedback = () => {
    return (
        <div className="container">
            <div className="header">
                <span className="back-icon">&larr;</span>
                Comprehension
            </div>
            <div className="content">
                <h2>Thank you for your Hardwork</h2>
                <div className="score">80/100</div>
                <div className="feedback">
                    <h3>Feedback</h3>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum, veniam
                        perferendis consectetur corrupti fuga quidem debitis, molestiae mollitia
                        placeat hic minima tempora officia blanditiis! Sint inventore ea repudiandae
                        sunt, repellendus ducimus necessitatibus quaerat ut officiis laboriosam.
                    </p>
                </div>
                <div className="footer">
                    <p>Our Regards,</p>
                    <p className="regards">Dolphin Streak</p>
                </div>
            </div>
            <div className="button-container">
                <button>Continue</button>
            </div>
        </div>
    );
};

export default ComprehensionFeedback;
