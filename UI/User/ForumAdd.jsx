import React from 'react';
import 'ForumAdd.css';

const ForumAdd = () => {
    return (
        <div>
            <div className="header">
                <img src="imgSource/back.png" alt="Back" />
                <h3>Forum</h3>
            </div>
            <div className="form-container">
                <div>
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" placeholder="Placeholder text" />
                </div>
                <div>
                    <div className="editor-toolbar">
                        <button><b>B</b></button>
                        <button><i>I</i></button>
                        <button><u>U</u></button>
                        <button>&#8226; &#8226; &#8226;</button>
                        <button>&#8212;</button>
                        <button>&#x1F4CE;</button>
                        <button>&#128247;</button>
                    </div>
                    <textarea placeholder="I am your rich text editor." />
                </div>
                <button className="submit-button">Create New Thread</button>
            </div>
        </div>
    );
};

export default ForumAdd;
