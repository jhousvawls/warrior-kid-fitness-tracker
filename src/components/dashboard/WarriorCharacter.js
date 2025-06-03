import React from 'react';

const WarriorCharacter = ({ weeklyProgress, size = 'large' }) => {
    const getWarriorStage = (progress) => {
        if (progress >= 5) return 5; // Epic warrior - goal achieved
        if (progress >= 4) return 4; // Full armor warrior
        if (progress >= 3) return 3; // Armored warrior with shield
        if (progress >= 2) return 2; // Warrior with sword and armor
        if (progress >= 1) return 1; // Basic warrior with helmet
        return 0; // Starting warrior
    };

    const getWarriorDisplay = (stage) => {
        const stages = {
            0: {
                character: '🧍',
                title: 'Rookie',
                description: 'Ready to begin the journey!',
                color: '#9ca3af',
                glow: false
            },
            1: {
                character: '⚔️🧑',
                title: 'Warrior Apprentice',
                description: 'First steps taken!',
                color: '#6b7280',
                glow: false
            },
            2: {
                character: '🛡️⚔️🧑',
                title: 'Armed Warrior',
                description: 'Getting stronger!',
                color: '#d97706',
                glow: false
            },
            3: {
                character: '🛡️⚔️👑🧑',
                title: 'Knight Warrior',
                description: 'Halfway to mastery!',
                color: '#059669',
                glow: false
            },
            4: {
                character: '✨🛡️⚔️👑🧑✨',
                title: 'Elite Warrior',
                description: 'Almost legendary!',
                color: '#7c3aed',
                glow: true
            },
            5: {
                character: '🌟👑⚔️🛡️🧑🛡️⚔️👑🌟',
                title: 'LEGENDARY WARRIOR',
                description: 'Weekly goal conquered!',
                color: '#f59e0b',
                glow: true
            }
        };
        return stages[stage];
    };

    const stage = getWarriorStage(weeklyProgress);
    const warrior = getWarriorDisplay(stage);
    
    const sizeStyles = {
        small: {
            fontSize: '2rem',
            padding: '1rem'
        },
        large: {
            fontSize: '3rem',
            padding: '2rem'
        }
    };

    return (
        <div className="warrior-character" style={{
            textAlign: 'center',
            ...sizeStyles[size]
        }}>
            <div 
                className={`warrior-display ${warrior.glow ? 'warrior-glow' : ''}`}
                style={{
                    fontSize: sizeStyles[size].fontSize,
                    marginBottom: '1rem',
                    transition: 'all 0.5s ease',
                    filter: warrior.glow ? 'drop-shadow(0 0 10px gold)' : 'none'
                }}
            >
                {warrior.character}
            </div>
            
            <div className="warrior-info">
                <h3 style={{
                    color: warrior.color,
                    fontWeight: 'bold',
                    fontSize: size === 'large' ? '1.2rem' : '1rem',
                    marginBottom: '0.5rem',
                    textShadow: warrior.glow ? '0 0 5px rgba(245, 158, 11, 0.5)' : 'none'
                }}>
                    {warrior.title}
                </h3>
                <p style={{
                    color: 'var(--charcoal-gray)',
                    fontSize: size === 'large' ? '0.9rem' : '0.8rem',
                    marginBottom: '1rem'
                }}>
                    {warrior.description}
                </p>
                
                {/* Progress dots showing daily achievements */}
                <div className="progress-dots" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginTop: '1rem'
                }}>
                    {[1, 2, 3, 4, 5].map(day => (
                        <div
                            key={day}
                            className={`progress-dot ${weeklyProgress >= day ? 'completed' : ''}`}
                            style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: weeklyProgress >= day ? warrior.color : '#e5e7eb',
                                transition: 'all 0.3s ease',
                                boxShadow: weeklyProgress >= day && warrior.glow ? 
                                    `0 0 8px ${warrior.color}` : 'none'
                            }}
                        />
                    ))}
                </div>
                
                <div style={{
                    marginTop: '0.5rem',
                    fontSize: '0.8rem',
                    color: 'var(--charcoal-gray)'
                }}>
                    {weeklyProgress}/5 Training Days
                </div>
            </div>
        </div>
    );
};

export default WarriorCharacter;
