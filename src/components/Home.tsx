import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const [playerId, setPlayerId] = useState('');
    const navigate = useNavigate();

    const handleStart = () => {
        if (playerId.trim()) {
            navigate('/game', { state: { playerId } });
        } else {
            alert('Please enter your ID!');
        }
    };

    return (
        <div className="pixel-container">
            <h1 className="question-text">PIXEL QUIZ QUEST</h1>
            <p style={{ marginBottom: '20px', fontSize: '14px', lineHeight: '1.5' }}>
                Enter your ID to start the challenge!
            </p>
            <input
                type="text"
                className="pixel-input"
                placeholder="ENTER ID..."
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
            />
            <button className="pixel-btn" onClick={handleStart}>
                START GAME
            </button>
        </div>
    );
};

export default Home;
