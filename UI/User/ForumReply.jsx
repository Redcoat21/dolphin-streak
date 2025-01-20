import React from 'react';
import "./ForumReply.css";
const ForumReply = () => {
    return (
        <div>
            <div className="header">
                <h3>Forum</h3>
            </div>

            <div className="forum-item">
                <div className="forum-title">Forum Title</div>
                <div className="forum-content">
                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Sit ullam voluptatibus consequatur, accusantium beatae enim repellat.
                </div>
                <div className="forum-reply">
                    <div><b>Reply To :</b> Forum Title</div>
                    <p>Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
                </div>
                <div className="forum-reply">
                    <div><b>Reply To :</b> Forum Title</div>
                    <p>Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
                </div>
                <div className="forum-item-footer">Sunday, 20-10-2024</div>
            </div>

            <div className="text-editor">
                <div className="tools">
                    <button>B</button>
                    <button>I</button>
                    <button>U</button>
                    <button>Link</button>
                    <button>Image</button>
                </div>
                <textarea placeholder="I am your rich text editor." />
            </div>

            <button className="reply-button">Reply To Thread</button>
        </div>
    );
};

export default ForumReply;
