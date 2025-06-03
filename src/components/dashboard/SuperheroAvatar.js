import React from 'react';

const SuperheroAvatar = ({ weeklyProgress, superheroType = 'strength', size = 'large' }) => {
    const getSuperheroStage = (progress) => {
        if (progress >= 5) return 4; // Legendary Hero
        if (progress >= 4) return 3; // Super Hero
        if (progress >= 2) return 2; // Hero
        if (progress >= 1) return 1; // Rising Hero
        return 0; // Rookie
    };

    const getSuperheroDisplay = (type, stage) => {
        const superheroTypes = {
            strength: {
                0: {
                    character: '🧑‍💼',
                    title: 'Rookie Strength',
                    description: 'Ready to discover your powers!',
                    color: '#6b7280',
                    powers: ''
                },
                1: {
                    character: '🦸‍♂️',
                    title: 'Rising Hero',
                    description: 'Your strength is awakening!',
                    color: '#dc2626',
                    powers: '💪'
                },
                2: {
                    character: '💪🦸‍♂️',
                    title: 'Captain Strength',
                    description: 'Powerful and getting stronger!',
                    color: '#dc2626',
                    powers: '💪⚡'
                },
                3: {
                    character: '⚡💪🦸‍♂️💪⚡',
                    title: 'Super Strength',
                    description: 'Incredible power unleashed!',
                    color: '#dc2626',
                    powers: '💪⚡🔥'
                },
                4: {
                    character: '🌟⚡💪🦸‍♂️💪⚡🌟',
                    title: 'LEGENDARY CHAMPION',
                    description: 'Ultimate strength achieved!',
                    color: '#f59e0b',
                    powers: '💪⚡🔥🌟'
                }
            },
            speed: {
                0: {
                    character: '🧑‍💼',
                    title: 'Rookie Speed',
                    description: 'Ready to run fast!',
                    color: '#6b7280',
                    powers: ''
                },
                1: {
                    character: '🦸‍♂️',
                    title: 'Rising Speedster',
                    description: 'Feeling the need for speed!',
                    color: '#eab308',
                    powers: '💨'
                },
                2: {
                    character: '⚡🦸‍♂️',
                    title: 'Captain Flash',
                    description: 'Lightning fast reflexes!',
                    color: '#eab308',
                    powers: '⚡💨'
                },
                3: {
                    character: '💨⚡🦸‍♂️⚡💨',
                    title: 'Super Speed',
                    description: 'Faster than lightning!',
                    color: '#eab308',
                    powers: '⚡💨🌪️'
                },
                4: {
                    character: '🌟💨⚡🦸‍♂️⚡💨🌟',
                    title: 'LEGENDARY SPEEDSTER',
                    description: 'Speed of light achieved!',
                    color: '#f59e0b',
                    powers: '⚡💨🌪️🌟'
                }
            },
            tech: {
                0: {
                    character: '🧑‍💼',
                    title: 'Rookie Tech',
                    description: 'Learning the gadgets!',
                    color: '#6b7280',
                    powers: ''
                },
                1: {
                    character: '🦸‍♂️',
                    title: 'Rising Inventor',
                    description: 'Building your first gadgets!',
                    color: '#1f2937',
                    powers: '🔧'
                },
                2: {
                    character: '🤖🦸‍♂️',
                    title: 'Captain Tech',
                    description: 'High-tech hero in action!',
                    color: '#1f2937',
                    powers: '🤖⚙️'
                },
                3: {
                    character: '⚙️🤖🦸‍♂️🤖⚙️',
                    title: 'Super Tech',
                    description: 'Advanced technology mastered!',
                    color: '#1f2937',
                    powers: '🤖⚙️🚀'
                },
                4: {
                    character: '🌟⚙️🤖🦸‍♂️🤖⚙️🌟',
                    title: 'LEGENDARY INVENTOR',
                    description: 'Ultimate technology achieved!',
                    color: '#f59e0b',
                    powers: '🤖⚙️🚀🌟'
                }
            },
            fire: {
                0: {
                    character: '🧑‍💼',
                    title: 'Rookie Fire',
                    description: 'Feeling the heat!',
                    color: '#6b7280',
                    powers: ''
                },
                1: {
                    character: '🦸‍♂️',
                    title: 'Rising Flame',
                    description: 'Your fire powers ignite!',
                    color: '#dc2626',
                    powers: '🔥'
                },
                2: {
                    character: '🔥🦸‍♂️',
                    title: 'Captain Blaze',
                    description: 'Burning with power!',
                    color: '#dc2626',
                    powers: '🔥💥'
                },
                3: {
                    character: '💥🔥🦸‍♂️🔥💥',
                    title: 'Super Fire',
                    description: 'Inferno powers unleashed!',
                    color: '#dc2626',
                    powers: '🔥💥🌋'
                },
                4: {
                    character: '🌟💥🔥🦸‍♂️🔥💥🌟',
                    title: 'LEGENDARY PHOENIX',
                    description: 'Ultimate fire mastery!',
                    color: '#f59e0b',
                    powers: '🔥💥🌋🌟'
                }
            }
        };
        
        return superheroTypes[type][stage];
    };

    const stage = getSuperheroStage(weeklyProgress);
    const superhero = getSuperheroDisplay(superheroType, stage);
    
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
        <div className="superhero-avatar" style={{
            textAlign: 'center',
            ...sizeStyles[size]
        }}>
            <div 
                className={`superhero-display ${stage >= 3 ? 'superhero-glow' : ''}`}
                style={{
                    fontSize: sizeStyles[size].fontSize,
                    marginBottom: '1rem',
                    transition: 'all 0.5s ease',
                    filter: stage >= 3 ? 'drop-shadow(0 0 15px gold)' : 'none'
                }}
            >
                {superhero.character}
            </div>
            
            <div className="superhero-info">
                <h3 style={{
                    color: superhero.color,
                    fontWeight: 'bold',
                    fontSize: size === 'large' ? '1.2rem' : '1rem',
                    marginBottom: '0.5rem',
                    textShadow: stage >= 3 ? '0 0 5px rgba(245, 158, 11, 0.5)' : 'none'
                }}>
                    {superhero.title}
                </h3>
                <p style={{
                    color: 'var(--charcoal-gray)',
                    fontSize: size === 'large' ? '0.9rem' : '0.8rem',
                    marginBottom: '1rem'
                }}>
                    {superhero.description}
                </p>
                
                {/* Power indicators */}
                {superhero.powers && (
                    <div style={{
                        fontSize: '1.5rem',
                        marginBottom: '1rem',
                        filter: stage >= 3 ? 'drop-shadow(0 0 5px gold)' : 'none'
                    }}>
                        {superhero.powers}
                    </div>
                )}
                
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
                                backgroundColor: weeklyProgress >= day ? superhero.color : '#e5e7eb',
                                transition: 'all 0.3s ease',
                                boxShadow: weeklyProgress >= day && stage >= 3 ? 
                                    `0 0 8px ${superhero.color}` : 'none'
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

export default SuperheroAvatar;
