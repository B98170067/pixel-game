import axios from 'axios';

const API_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;

export interface Question {
    id: number;
    question: string;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
    };
    // Answer is strictly handled on backend for security, but for simple game logic we might receive it or validate on backend.
    // The requirement says "excluding answer column" in fetch, so assume backend validates or user just sends choice.
    // Actually, for immediate feedback, we might need the answer or validate via another call.
    // Requirement: "Fetch randomly N questions (not including answer column)"
    // So client does NOT know the answer.
    // Wait, how do we calculate score then?
    // "Calculate score -> send to GAS".
    // If client doesn't know answer, it cannot calculate score.
    // Perhaps the requirement means "Fetch questions" and then "Submit answers" and backend calculates score?
    // "Submit answers to Google Apps Script to calculate score" - Yes.
}

export interface ScoreData {
    id: string; // Player ID
    score: number; // Oh wait, if backend calculates score, why do we send score?
    // "Calculate result -> record to Sheet"
    // "Submit answering result to GAS to calculate score"
    // So we probably send { questionId: answer } map?
    // Let's assume we send the answers and backend returns the score.
    answers: Record<string, string>;
}

export const fetchQuestions = async (count: number): Promise<Question[]> => {
    if (!API_URL) return []; // Mock or error
    try {
        const response = await axios.get(`${API_URL}?action=getQuestions&count=${count}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch questions", error);
        return [];
    }
};

export const submitAnswers = async (playerId: string, answers: Record<string, string>): Promise<{
    score: number,
    passed: boolean,
    details?: { id: string, correctAnswer: string, userAnswer: string, isCorrect: boolean }[]
}> => {
    if (!API_URL) return { score: 0, passed: false };
    try {
        // using output=json for GAS
        // We typically use POST for submission
        // But GAS doPost has CORS issues sometimes with simple requests.
        // Let's assume standard POST with 'application/x-www-form-urlencoded' or similar if needed, or just JSON stringified payload.
        const response = await axios.post(API_URL, JSON.stringify({
            action: 'brief', // or just payload
            playerId,
            answers
        }), {
            headers: {
                "Content-Type": "text/plain;charset=utf-8", // content-type text/plain avoids CORS preflight often in GAS
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to submit score", error);
        throw error;
    }
};
