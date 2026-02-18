import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Result: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { score, total, passed, playerId, questions, details } = location.state || {
        score: 0, total: 0, passed: false, playerId: '', questions: [], details: []
    };

    const [showReview, setShowReview] = React.useState(false);

    // Helper to find result for a question
    const getResult = (qId: number) => details?.find((d: any) => d.id == qId);

    if (showReview) {
        return (
            <div className="pixel-container" style={{ maxWidth: '800px', width: '100%' }}>
                <h2 className="question-text">REVIEW RESULTS</h2>
                <div style={{ textAlign: 'left', maxHeight: '60vh', overflowY: 'auto' }}>
                    {questions.map((q: any, index: number) => {
                        const res = getResult(q.id);
                        const isCorrect = res?.isCorrect;
                        return (
                            <div key={q.id} style={{ marginBottom: '20px', padding: '10px', border: '2px solid #000', backgroundColor: isCorrect ? '#cfc' : '#fcc', color: '#000' }}>
                                <p style={{ fontSize: '14px', marginBottom: '5px' }}>{index + 1}. {q.question}</p>
                                <p style={{ fontSize: '12px', color: '#555' }}>Your Answer: {res?.userAnswer || 'N/A'}</p>
                                {!isCorrect && (
                                    <p style={{ fontSize: '12px', color: '#d00', fontWeight: 'bold' }}>Correct: {res?.correctAnswer}</p>
                                )}
                            </div>
                        );
                    })}
                </div>
                <button className="pixel-btn" onClick={() => setShowReview(false)}>
                    BACK
                </button>
            </div>
        );
    }

    return (
        <div className="pixel-container">
            <h1 className="question-text">GAME OVER</h1>

            <div style={{ margin: '30px 0' }}>
                <p style={{ fontSize: '24px', marginBottom: '10px' }}>SCORE: {score} / {total}</p>
                <p style={{ color: passed ? '#0f0' : '#f00', fontSize: '20px' }}>
                    {passed ? 'MISSION ACCOMPLISHED!' : 'MISSION FAILED!'}
                </p>
            </div>

            <button className="pixel-btn" onClick={() => setShowReview(true)}>
                REVIEW
            </button>

            <button className="pixel-btn" style={{ marginTop: '10px' }} onClick={() => navigate('/game', { state: { playerId } })}>
                PLAY AGAIN
            </button>
            <button className="pixel-btn" style={{ backgroundColor: '#fff', marginTop: '10px' }} onClick={() => navigate('/')}>
                HOME
            </button>
        </div>
    );
};

export default Result;
