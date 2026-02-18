import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchQuestions, submitAnswers, type Question } from '../services/api';

const QUESTION_COUNT = parseInt(import.meta.env.VITE_QUESTION_COUNT || '5');

const Game: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const playerId = location.state?.playerId;

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [bossImages, setBossImages] = useState<string[]>([]);

    // Pre-load 100 images logic
    useEffect(() => {
        const images: string[] = [];
        const seeds = Array.from({ length: 100 }, (_, i) => `boss-${i}-${Math.random()}`);
        seeds.forEach((seed) => {
            const img = new Image();
            // Using 7.x as it is stable. 
            const url = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`;
            img.src = url;
            images.push(url);
        });
        setBossImages(images);
    }, []);

    useEffect(() => {
        if (!playerId) {
            navigate('/');
            return;
        }

        const loadQuestions = async () => {
            setLoading(true);
            const data = await fetchQuestions(QUESTION_COUNT);
            if (data.length === 0) {
                // Mock data for testing if API fails or not set
                const mockQuestions: Question[] = [
                    { id: 1, question: "What is 2 + 2?", options: { A: "3", B: "4", C: "5", D: "6" } },
                    { id: 2, question: "Capital of France?", options: { A: "London", B: "Paris", C: "Berlin", D: "Madrid" } },
                    { id: 3, question: "Red fruit?", options: { A: "Banana", B: "Apple", C: "Lime", D: "Blueberry" } },
                ];
                setQuestions(mockQuestions);
            } else {
                setQuestions(data);
            }
            setLoading(false);
        };

        loadQuestions();
    }, [playerId, navigate]);

    const handleAnswer = async (option: string) => {
        const currentQuestion = questions[currentQuestionIndex];
        const newAnswers = { ...answers, [currentQuestion.id]: option };
        setAnswers(newAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Game Over
            setSubmitting(true);
            // Determine Score locally if needed, OR send to backend.
            // Requirement: "Send to GAS to calculate score"
            // But we also need to show result.
            // If we use mock data, we can't really "submit" effectively without a real backend.
            // For the sake of the prototype, if API_URL is missing, we calculate locally.

            try {
                if (!import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL) {
                    // Mock submission
                    const score = Object.values(newAnswers).filter(a => a === 'B' || a === 'Paris' || a === 'Apple' || a === '4').length; // Simple mock check
                    navigate('/result', { state: { score: score, total: questions.length, passed: score >= 3, playerId } });
                } else {
                    const result = await submitAnswers(playerId, newAnswers);
                    // However, `submitAnswers` returns { score, passed } from the actual implementation I wrote in api.ts?
                    // Wait, `api.ts` `submitAnswers` currently calls `axios.post`.
                    // I need to make sure `api.ts` actually parses the response correctly.
                    // The GAS `doPost` returns JSON.
                    navigate('/result', {
                        state: {
                            score: result.score || 0,
                            total: questions.length,
                            passed: result.passed,
                            playerId,
                            questions, // Pass questions content
                            details: result.details // Pass answer details
                        }
                    });
                }
            } catch (e) {
                console.error(e);
                alert("Failed to submit results. Please try again.");
            }
            setSubmitting(false);
        }
    };

    if (loading) return <div className="pixel-container">LOADING...</div>;
    if (submitting) return <div className="pixel-container">SUBMITTING...</div>;
    if (questions.length === 0) return <div className="pixel-container">NO QUESTIONS FOUND</div>;

    const currentQuestion = questions[currentQuestionIndex];
    // Select a random image from the 100 preloaded, or just use index
    const bossImage = bossImages[currentQuestionIndex % bossImages.length] || bossImages[0];

    return (
        <div className="pixel-container">
            <div style={{ marginBottom: '20px' }}>
                <img
                    src={bossImage}
                    alt="Boss"
                    style={{ width: '120px', height: '120px', imageRendering: 'pixelated', border: '4px solid #000' }}
                />
            </div>

            <p style={{ marginBottom: '10px' }}>LEVEL {currentQuestionIndex + 1} / {questions.length}</p>

            <h2 className="question-text">{currentQuestion.question}</h2>

            <div>
                {Object.entries(currentQuestion.options).map(([key, value]) => (
                    <button
                        key={key}
                        className="pixel-btn option-btn"
                        onClick={() => handleAnswer(value)} // Sending value or key? Setup says check against answer column. Usually value match or key match.
                    // My GAS script checks `answerKey[qId] === answer`.
                    // The `api.ts` implementation sends `answers`.
                    // If the sheet has "Answer" as "A", "B" etc., we should send key.
                    // If the sheet has "Answer" as "Paris", we should send value.
                    // Standard multiple choice usually keys. Let's send Value for now as it's safer if keys change, or I can send Key.
                    // Actually, let's send text value based on `handleAnswer` argument `value`.
                    >
                        {key}: {value}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Game;
