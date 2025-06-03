import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wordpressAPI } from '../services/wordpressAPI';

const AboutPage = () => {
    const [pageContent, setPageContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAboutPage = async () => {
            try {
                // Try to fetch the about page from WordPress
                const page = await wordpressAPI.getPageBySlug('about');
                setPageContent(page);
            } catch (err) {
                // If WordPress content isn't available, we'll show default content
                console.log('WordPress about page not found, using default content');
            } finally {
                setLoading(false);
            }
        };

        fetchAboutPage();
    }, []);

    // Default content if WordPress isn't available yet
    const defaultContent = {
        title: { rendered: 'About Me' },
        content: { 
            rendered: `
                <p>Welcome to the Warrior Kid Fitness Tracker! I'm passionate about helping young people build discipline, strength, and character through fitness.</p>
                
                <h3>My Mission</h3>
                <p>To create a fun, engaging platform that makes fitness accessible and enjoyable for kids aged 5-18. Every workout is designed to build not just physical strength, but mental toughness and discipline that will serve them throughout their lives.</p>
                
                <h3>Why Warrior Kid Fitness?</h3>
                <p>Inspired by the principles of discipline and perseverance, this platform combines proven bodyweight exercises with gamification elements that keep kids motivated and coming back for more.</p>
                
                <h3>What Makes Us Different</h3>
                <ul>
                    <li><strong>Age-Appropriate:</strong> Exercises designed specifically for young bodies</li>
                    <li><strong>No Equipment Needed:</strong> All bodyweight exercises that can be done anywhere</li>
                    <li><strong>Gamified Experience:</strong> Earn screen time, track progress, and compete with friends</li>
                    <li><strong>Character Building:</strong> Focus on discipline, perseverance, and mental toughness</li>
                    <li><strong>Safe & Secure:</strong> Kid-friendly interface with simple, secure login</li>
                </ul>
            `
        }
    };

    const content = pageContent || defaultContent;

    if (loading) {
        return (
            <div style={{ 
                padding: '4rem 2rem', 
                textAlign: 'center',
                minHeight: '50vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="page-hero" style={{
                background: 'linear-gradient(135deg, var(--navy-blue), var(--forest-green))',
                color: 'white',
                padding: '3rem 2rem',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        marginBottom: '1rem',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                    }}>
                        {content.title.rendered}
                    </h1>
                    <p style={{
                        fontSize: '1.2rem',
                        opacity: '0.95',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Building the next generation of disciplined, strong, and confident young warriors.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="page-content" style={{
                padding: '4rem 2rem',
                backgroundColor: 'white'
            }}>
                <div style={{ 
                    maxWidth: '800px', 
                    margin: '0 auto',
                    lineHeight: '1.8'
                }}>
                    <div 
                        style={{
                            color: 'var(--charcoal-gray)',
                            fontSize: '1.1rem'
                        }}
                        dangerouslySetInnerHTML={{ __html: content.content.rendered }}
                    />
                </div>
            </section>

            {/* Values Section */}
            <section className="values-section" style={{
                padding: '4rem 2rem',
                backgroundColor: 'var(--light-gray)'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{
                        textAlign: 'center',
                        fontSize: '2.5rem',
                        color: 'var(--navy-blue)',
                        marginBottom: '3rem'
                    }}>
                        Core Values
                    </h2>
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '2rem'
                    }}>
                        <div className="value-card" style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '12px',
                            textAlign: 'center',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            border: '2px solid var(--navy-blue)'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💪</div>
                            <h3 style={{ color: 'var(--navy-blue)', marginBottom: '1rem' }}>Discipline</h3>
                            <p style={{ color: 'var(--charcoal-gray)', lineHeight: '1.6' }}>
                                Building consistent habits and mental toughness through regular exercise and commitment.
                            </p>
                        </div>

                        <div className="value-card" style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '12px',
                            textAlign: 'center',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            border: '2px solid var(--forest-green)'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                            <h3 style={{ color: 'var(--forest-green)', marginBottom: '1rem' }}>Excellence</h3>
                            <p style={{ color: 'var(--charcoal-gray)', lineHeight: '1.6' }}>
                                Striving to be better than yesterday and pushing beyond comfort zones.
                            </p>
                        </div>

                        <div className="value-card" style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '12px',
                            textAlign: 'center',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            border: '2px solid var(--amber-orange)'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
                            <h3 style={{ color: 'var(--amber-orange)', marginBottom: '1rem' }}>Character</h3>
                            <p style={{ color: 'var(--charcoal-gray)', lineHeight: '1.6' }}>
                                Developing integrity, respect, and leadership through physical and mental challenges.
                            </p>
                        </div>

                        <div className="value-card" style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '12px',
                            textAlign: 'center',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            border: '2px solid var(--success-green)'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌟</div>
                            <h3 style={{ color: 'var(--success-green)', marginBottom: '1rem' }}>Growth</h3>
                            <p style={{ color: 'var(--charcoal-gray)', lineHeight: '1.6' }}>
                                Embracing challenges as opportunities to learn, improve, and become stronger.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="cta-section" style={{
                background: 'linear-gradient(135deg, var(--forest-green), var(--success-green))',
                color: 'white',
                padding: '4rem 2rem',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        marginBottom: '1.5rem',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                    }}>
                        Ready to Join the Mission?
                    </h2>
                    <p style={{
                        fontSize: '1.2rem',
                        marginBottom: '2rem',
                        opacity: '0.95'
                    }}>
                        Start your warrior journey today and build the discipline that will serve you for life.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link 
                            to="/app" 
                            className="btn btn-accent"
                            style={{
                                fontSize: '1.2rem',
                                padding: '1rem 2rem',
                                textDecoration: 'none',
                                boxShadow: '0 4px 15px rgba(217, 119, 6, 0.3)'
                            }}
                        >
                            🚀 Start Training
                        </Link>
                        <Link 
                            to="/contact" 
                            className="btn btn-secondary"
                            style={{
                                fontSize: '1.1rem',
                                padding: '1rem 2rem',
                                textDecoration: 'none',
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                border: '2px solid white',
                                color: 'white'
                            }}
                        >
                            Get in Touch
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
