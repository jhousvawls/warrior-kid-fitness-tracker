import React, { useState, useEffect } from 'react';

const EnhancedMathChallenge = ({ onSuccess, onCancel, userAge = 10 }) => {
    const [problems, setProblems] = useState([]);
    const [currentProblem, setCurrentProblem] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState('');
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [showResult, setShowResult] = useState(false);

    // Generate age-appropriate math problems
    const generateProblems = (age) => {
        const problemCount = 3; // 3 problems to complete
        const generatedProblems = [];

        for (let i = 0; i < problemCount; i++) {
            let problem;
            
            if (age <= 7) {
                // Ages 5-7: Simple addition and subtraction (single digits)
                problem = generateSimpleProblem();
            } else if (age <= 10) {
                // Ages 8-10: Addition, subtraction, and basic multiplication
                problem = generateIntermediateProblem();
            } else if (age <= 13) {
                // Ages 11-13: More complex operations including division
                problem = generateAdvancedProblem();
            } else {
                // Ages 14+: Advanced math with fractions and word problems
                problem = generateExpertProblem();
            }
            
            generatedProblems.push(problem);
        }
        
        return generatedProblems;
    };

    const generateSimpleProblem = () => {
        const operations = ['+', '-'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        let num1, num2, answer;
        
        if (operation === '+') {
            num1 = Math.floor(Math.random() * 9) + 1; // 1-9
            num2 = Math.floor(Math.random() * 9) + 1; // 1-9
            answer = num1 + num2;
        } else {
            num1 = Math.floor(Math.random() * 9) + 5; // 5-13 (ensure positive result)
            num2 = Math.floor(Math.random() * num1) + 1; // 1 to num1
            answer = num1 - num2;
        }
        
        return {
            question: `${num1} ${operation} ${num2} = ?`,
            answer: answer,
            type: 'arithmetic',
            difficulty: 'Beginner'
        };
    };

    const generateIntermediateProblem = () => {
        const operations = ['+', '-', '×'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        let num1, num2, answer;
        
        if (operation === '+') {
            num1 = Math.floor(Math.random() * 50) + 10; // 10-59
            num2 = Math.floor(Math.random() * 30) + 5;  // 5-34
            answer = num1 + num2;
        } else if (operation === '-') {
            num1 = Math.floor(Math.random() * 50) + 20; // 20-69
            num2 = Math.floor(Math.random() * 15) + 5;  // 5-19
            answer = num1 - num2;
        } else { // multiplication
            num1 = Math.floor(Math.random() * 9) + 2;   // 2-10
            num2 = Math.floor(Math.random() * 9) + 2;   // 2-10
            answer = num1 * num2;
        }
        
        return {
            question: `${num1} ${operation} ${num2} = ?`,
            answer: answer,
            type: 'arithmetic',
            difficulty: 'Intermediate'
        };
    };

    const generateAdvancedProblem = () => {
        const problemTypes = ['arithmetic', 'word'];
        const type = problemTypes[Math.floor(Math.random() * problemTypes.length)];
        
        if (type === 'word') {
            return generateWordProblem();
        }
        
        const operations = ['+', '-', '×', '÷'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        let num1, num2, answer;
        
        if (operation === '+') {
            num1 = Math.floor(Math.random() * 200) + 50; // 50-249
            num2 = Math.floor(Math.random() * 100) + 25; // 25-124
            answer = num1 + num2;
        } else if (operation === '-') {
            num1 = Math.floor(Math.random() * 200) + 100; // 100-299
            num2 = Math.floor(Math.random() * 50) + 10;   // 10-59
            answer = num1 - num2;
        } else if (operation === '×') {
            num1 = Math.floor(Math.random() * 15) + 5;    // 5-19
            num2 = Math.floor(Math.random() * 10) + 3;    // 3-12
            answer = num1 * num2;
        } else { // division
            answer = Math.floor(Math.random() * 20) + 5;  // 5-24
            num2 = Math.floor(Math.random() * 8) + 2;     // 2-9
            num1 = answer * num2;
        }
        
        return {
            question: `${num1} ${operation} ${num2} = ?`,
            answer: answer,
            type: 'arithmetic',
            difficulty: 'Advanced'
        };
    };

    const generateWordProblem = () => {
        const scenarios = [
            {
                story: "Sarah has {num1} stickers. She gives {num2} stickers to her friend. How many stickers does Sarah have left?",
                operation: 'subtraction'
            },
            {
                story: "There are {num1} students in class. Each student has {num2} pencils. How many pencils are there in total?",
                operation: 'multiplication'
            },
            {
                story: "Mike collected {num1} baseball cards this week and {num2} cards last week. How many cards does he have in total?",
                operation: 'addition'
            },
            {
                story: "A pizza is cut into {num1} equal slices. If {num2} friends share it equally, how many slices does each friend get?",
                operation: 'division'
            }
        ];
        
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        let num1, num2, answer;
        
        switch (scenario.operation) {
            case 'addition':
                num1 = Math.floor(Math.random() * 50) + 10;
                num2 = Math.floor(Math.random() * 30) + 5;
                answer = num1 + num2;
                break;
            case 'subtraction':
                num1 = Math.floor(Math.random() * 50) + 20;
                num2 = Math.floor(Math.random() * 15) + 5;
                answer = num1 - num2;
                break;
            case 'multiplication':
                num1 = Math.floor(Math.random() * 10) + 5;
                num2 = Math.floor(Math.random() * 8) + 2;
                answer = num1 * num2;
                break;
            case 'division':
                answer = Math.floor(Math.random() * 8) + 2;
                num2 = Math.floor(Math.random() * 6) + 2;
                num1 = answer * num2;
                break;
            default:
                num1 = 10;
                num2 = 5;
                answer = 15;
        }
        
        return {
            question: scenario.story.replace('{num1}', num1).replace('{num2}', num2),
            answer: answer,
            type: 'word',
            difficulty: 'Advanced'
        };
    };

    const generateExpertProblem = () => {
        const problemTypes = ['fraction', 'percentage', 'algebra'];
        const type = problemTypes[Math.floor(Math.random() * problemTypes.length)];
        
        if (type === 'fraction') {
            // Simple fraction addition
            const denom = Math.floor(Math.random() * 6) + 4; // 4-9
            const num1 = Math.floor(Math.random() * (denom - 1)) + 1;
            const num2 = Math.floor(Math.random() * (denom - num1)) + 1;
            const answer = num1 + num2;
            
            return {
                question: `${num1}/${denom} + ${num2}/${denom} = ?/${denom}`,
                answer: answer,
                type: 'fraction',
                difficulty: 'Expert',
                hint: 'Add the numerators, keep the denominator the same'
            };
        } else if (type === 'percentage') {
            const total = [20, 25, 50, 100][Math.floor(Math.random() * 4)];
            const percent = [10, 20, 25, 50][Math.floor(Math.random() * 4)];
            const answer = (total * percent) / 100;
            
            return {
                question: `What is ${percent}% of ${total}?`,
                answer: answer,
                type: 'percentage',
                difficulty: 'Expert'
            };
        } else { // algebra
            const x = Math.floor(Math.random() * 10) + 1;
            const constant = Math.floor(Math.random() * 20) + 5;
            const result = x + constant;
            
            return {
                question: `If x + ${constant} = ${result}, what is x?`,
                answer: x,
                type: 'algebra',
                difficulty: 'Expert'
            };
        }
    };

    useEffect(() => {
        const newProblems = generateProblems(userAge);
        setProblems(newProblems);
    }, [userAge]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!userAnswer.trim()) {
            setFeedback('Please enter an answer!');
            return;
        }
        
        const currentProblemData = problems[currentProblem];
        const userNum = parseFloat(userAnswer);
        const isCorrect = Math.abs(userNum - currentProblemData.answer) < 0.01;
        
        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
            setFeedback('🎉 Correct! Great job!');
        } else {
            setFeedback(`❌ Not quite. The answer is ${currentProblemData.answer}`);
        }
        
        setTimeout(() => {
            if (currentProblem < problems.length - 1) {
                setCurrentProblem(prev => prev + 1);
                setUserAnswer('');
                setFeedback('');
            } else {
                setShowResult(true);
            }
        }, 2000);
    };

    const handleComplete = () => {
        const passThreshold = Math.ceil(problems.length * 0.67); // Need 67% to pass
        if (correctAnswers >= passThreshold) {
            onSuccess();
        } else {
            // Restart with new problems
            setCurrentProblem(0);
            setCorrectAnswers(0);
            setUserAnswer('');
            setFeedback('');
            setShowResult(false);
            const newProblems = generateProblems(userAge);
            setProblems(newProblems);
        }
    };

    if (problems.length === 0) {
        return (
            <div className="math-challenge">
                <div className="challenge-content">
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧮</div>
                        <p>Generating your math challenge...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (showResult) {
        const passThreshold = Math.ceil(problems.length * 0.67);
        const passed = correctAnswers >= passThreshold;
        
        return (
            <div className="math-challenge">
                <div className="challenge-content">
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                            {passed ? '🏆' : '💪'}
                        </div>
                        <h2 style={{ color: 'var(--navy-blue)', marginBottom: '1rem' }}>
                            {passed ? 'Challenge Complete!' : 'Keep Practicing!'}
                        </h2>
                        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                            You got {correctAnswers} out of {problems.length} correct!
                        </p>
                        <p style={{ color: 'var(--charcoal-gray)', marginBottom: '2rem' }}>
                            {passed 
                                ? 'Excellent work! You\'re ready to start your workout!' 
                                : `You need ${passThreshold} correct to pass. Let's try again!`
                            }
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                className="btn btn-primary"
                                onClick={handleComplete}
                                style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
                            >
                                {passed ? '🚀 Start Workout!' : '🔄 Try Again'}
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={onCancel}
                                style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const currentProblemData = problems[currentProblem];
    const difficultyColors = {
        'Beginner': 'var(--forest-green)',
        'Intermediate': 'var(--amber-orange)',
        'Advanced': 'var(--navy-blue)',
        'Expert': 'var(--warning-red)'
    };

    return (
        <div className="math-challenge">
            <div className="challenge-content">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ color: 'var(--navy-blue)', marginBottom: '0.5rem' }}>
                        🧮 Enhanced Warrior Challenge!
                    </h2>
                    <p style={{ color: 'var(--charcoal-gray)', marginBottom: '1rem' }}>
                        Solve these math problems to prove you're ready!
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
                        <span style={{ 
                            background: difficultyColors[currentProblemData.difficulty],
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                        }}>
                            {currentProblemData.difficulty}
                        </span>
                        <span style={{ 
                            background: 'var(--light-gray)',
                            color: 'var(--charcoal-gray)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                        }}>
                            Problem {currentProblem + 1} of {problems.length}
                        </span>
                    </div>
                </div>

                <div style={{
                    background: 'var(--amber-orange)',
                    borderRadius: '12px',
                    padding: '2rem',
                    color: 'white',
                    textAlign: 'center',
                    marginBottom: '2rem'
                }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '1rem', lineHeight: '1.4' }}>
                        {currentProblemData.question}
                    </div>
                    
                    {currentProblemData.hint && (
                        <div style={{ 
                            fontSize: '0.9rem', 
                            opacity: 0.9,
                            fontStyle: 'italic',
                            marginBottom: '1rem'
                        }}>
                            💡 Hint: {currentProblemData.hint}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <input
                            type="number"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Your answer"
                            style={{
                                fontSize: '1.2rem',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: 'none',
                                textAlign: 'center',
                                width: '200px',
                                marginBottom: '1rem'
                            }}
                            autoFocus
                        />
                        <br />
                        <button
                            type="submit"
                            className="btn"
                            style={{
                                background: 'var(--forest-green)',
                                color: 'white',
                                fontSize: '1rem',
                                padding: '0.75rem 2rem',
                                border: 'none'
                            }}
                        >
                            Submit Answer
                        </button>
                    </form>
                </div>

                {feedback && (
                    <div style={{
                        textAlign: 'center',
                        padding: '1rem',
                        background: feedback.includes('Correct') ? '#d1fae5' : '#fee2e2',
                        color: feedback.includes('Correct') ? '#065f46' : '#dc2626',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        fontWeight: 'bold'
                    }}>
                        {feedback}
                    </div>
                )}

                <div style={{ textAlign: 'center' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={onCancel}
                        style={{ fontSize: '0.9rem' }}
                    >
                        Cancel
                    </button>
                </div>

                {/* Progress indicator */}
                <div style={{ 
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    fontSize: '0.9rem',
                    color: 'var(--charcoal-gray)'
                }}>
                    ✅ {correctAnswers} correct
                </div>
            </div>
        </div>
    );
};

export default EnhancedMathChallenge;
