import React from 'react';
import "./Forum.css";

const Forum = () => {
    return (
        <div>
            <div className="header">
                <img src="imgSource/back.png" alt="Back" />
                <h3>Forum</h3>
            </div>
            <div className="search-container">
                <input type="text" placeholder="Search Forum" />
                <button>+</button>
            </div>
            <div className="forum-list">
                <div className="forum-item">
                    <div className="forum-item-header">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src="imgSource/user.png" alt="User" />
                            <h4>Forum Title</h4>
                        </div>
                        <span>~Person</span>
                    </div>
                    <div className="forum-item-content">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lobortis convallis accumsan condimentum...
                    </div>
                    <div className="forum-item-footer">
                        Sunday, 20-10-2024
                    </div>
                </div>
                {/* Tambahkan lebih banyak forum-item sesuai kebutuhan */}
            </div>
            <div className="pagination">
                <button>1</button>
                <button>2</button>
                <button>3</button>
                <span>...</span>
                <button>99</button>
            </div>
        </div>
    );
};

export default Forum;
