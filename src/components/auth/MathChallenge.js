import React, { useState, useEffect } from 'react';

const MathChallenge = ({ onSuccess, onCancel }) => {
    const [problem, setProblem] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        generateProblem();
    }, []);

    const generateProblem = () => {
        // Generate simple math problems for kids
        const operations = ['+', '-', '*'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        let num1, num2, answer;
        
        switch (operation) {
            case '+':
                num1 = Math.floor(Math.random() * 20) + 1;
                num2 = Math.floor(Math.random() * 20) + 1;
                answer = num1 + num2;
                break;
            case '-':
                num1 = Math.floor(Math.random() * 20) + 10;
                num2 = Math.floor(Math.random() * num1) + 1;
                answer = num1 - num2;
                break;
            case '*':
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                answer = num1 * num2;
                break;
        }
        
        setProblem({
            question: `${num1} ${operation} ${num2} = ?`,
            answer: answer
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const answer = parseInt(userAnswer);
        
        if (isNaN(answer)) {
            setError('Please enter a number');
            return;
        }
        
        if (answer === problem.answer) {
            onSuccess();
        } else {
            setError('Incorrect answer. Try again!');
            setUserAnswer('');
            generateProblem();
        }
    };

    return (
        <div className="math-challenge">
            <h3>Warrior Challenge!</h3>
            <p>Solve this math problem to prove you're ready:</p>
            
            {problem && (
                <div className="math-problem">
                    {problem.question}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Your answer"
                        autoFocus
                        style={{
                            textAlign: 'center',
                            fontSize: '1.2rem',
                            padding: '1rem'
                        }}
                    />
                </div>
                
                {error && (
                    <div style={{ color: 'white', marginBottom: '1rem' }}>
                        {error}
                    </div>
                )}
                
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button type="submit" className="btn btn-success">
                        Submit Answer
                    </button>
                    <button type="button" onClick={onCancel} className="btn btn-secondary">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MathChallenge;
