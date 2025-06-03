import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wordpressAPI, wpUtils } from '../services/wordpressAPI';

const HomePage = () => {
    const [featuredPosts, setFeaturedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeaturedPosts = async () => {
            try {
                const posts = await wordpressAPI.getFeaturedPosts(3);
                setFeaturedPosts(posts);
            } catch (err) {
                setError('Failed to load featured posts');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedPosts();
    }, []);

    return (
        <div className="homepage">
            {/* Hero Section */}
            <section className="hero-section" style={{
                background: 'linear-gradient(135deg, var(--navy-blue), var(--forest-green))',
                color: 'white',
                padding: '4rem 2rem',
                textAlign: 'center',
                minHeight: '60vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ maxWidth: '800px' }}>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: 'bold',
                        marginBottom: '1.5rem',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                    }}>
                        🏆 Warrior Kid Fitness Tracker
                    </h1>
                    <p style={{
                        fontSize: '1.3rem',
                        marginBottom: '2rem',
                        lineHeight: '1.6',
                        opacity: '0.95'
                    }}>
                        Build discipline, strength, and character through fun fitness challenges designed for young warriors aged 5-18.
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
                            🚀 Start Training Now
                        </Link>
                        <Link 
                            to="/about" 
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
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works" style={{
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
                        How It Works
                    </h2>
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem',
                        marginBottom: '3rem'
                    }}>
                        <div className="feature-card" style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '12px',
                            textAlign: 'center',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            border: '2px solid var(--navy-blue)'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                            <h3 style={{ color: 'var(--navy-blue)', marginBottom: '1rem' }}>Simple Login</h3>
                            <p style={{ color: 'var(--charcoal-gray)', lineHeight: '1.6' }}>
                                Kids create their warrior profile with just a name and age. A fun math challenge keeps it secure and engaging.
                            </p>
                        </div>

                        <div className="feature-card" style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '12px',
                            textAlign: 'center',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            border: '2px solid var(--forest-green)'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💪</div>
                            <h3 style={{ color: 'var(--forest-green)', marginBottom: '1rem' }}>Fun Workouts</h3>
                            <p style={{ color: 'var(--charcoal-gray)', lineHeight: '1.6' }}>
                                Complete 3 rounds of bodyweight exercises with animated guides, timers, and motivational celebrations.
                            </p>
                        </div>

                        <div className="feature-card" style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '12px',
                            textAlign: 'center',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            border: '2px solid var(--amber-orange)'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
                            <h3 style={{ color: 'var(--amber-orange)', marginBottom: '1rem' }}>Earn Rewards</h3>
                            <p style={{ color: 'var(--charcoal-gray)', lineHeight: '1.6' }}>
                                Earn screen time, track progress, compete on leaderboards, and watch your warrior character grow stronger.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Blog Posts */}
            <section className="featured-posts" style={{
                padding: '4rem 2rem',
                backgroundColor: 'white'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{
                        textAlign: 'center',
                        fontSize: '2.5rem',
                        color: 'var(--navy-blue)',
                        marginBottom: '3rem'
                    }}>
                        Latest Fitness Tips
                    </h2>

                    {loading && (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <p>Loading latest posts...</p>
                        </div>
                    )}

                    {error && (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <p style={{ color: 'var(--error-red)' }}>{error}</p>
                        </div>
                    )}

                    {!loading && !error && featuredPosts.length > 0 && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                            gap: '2rem',
                            marginBottom: '3rem'
                        }}>
                            {featuredPosts.map(post => (
                                <article key={post.id} className="post-card" style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                    border: '1px solid var(--light-gray)',
                                    transition: 'transform 0.3s ease'
                                }}>
                                    {wpUtils.getFeaturedImageUrl(post) && (
                                        <img 
                                            src={wpUtils.getFeaturedImageUrl(post)} 
                                            alt={post.title.rendered}
                                            style={{
                                                width: '100%',
                                                height: '200px',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    )}
                                    <div style={{ padding: '1.5rem' }}>
                                        <h3 style={{
                                            color: 'var(--navy-blue)',
                                            marginBottom: '1rem',
                                            fontSize: '1.3rem'
                                        }}>
                                            {post.title.rendered}
                                        </h3>
                                        <p style={{
                                            color: 'var(--charcoal-gray)',
                                            lineHeight: '1.6',
                                            marginBottom: '1rem'
                                        }}>
                                            {wpUtils.getCleanExcerpt(post)}
                                        </p>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            fontSize: '0.9rem',
                                            color: 'var(--charcoal-gray)',
                                            marginBottom: '1rem'
                                        }}>
                                            <span>{wpUtils.formatDate(post.date)}</span>
                                            <span>By {wpUtils.getAuthorName(post)}</span>
                                        </div>
                                        <Link 
                                            to={`/blog/${post.slug}`}
                                            className="btn btn-primary"
                                            style={{
                                                textDecoration: 'none',
                                                fontSize: '0.9rem',
                                                padding: '0.75rem 1.5rem'
                                            }}
                                        >
                                            Read More
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    <div style={{ textAlign: 'center' }}>
                        <Link 
                            to="/blog" 
                            className="btn btn-accent"
                            style={{
                                textDecoration: 'none',
                                fontSize: '1.1rem',
                                padding: '1rem 2rem'
                            }}
                        >
                            View All Posts
                        </Link>
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
                        Ready to Start Your Warrior Journey?
                    </h2>
                    <p style={{
                        fontSize: '1.2rem',
                        marginBottom: '2rem',
                        opacity: '0.95'
                    }}>
                        Join thousands of young warriors building discipline, strength, and character through fitness.
                    </p>
                    <Link 
                        to="/app" 
                        className="btn btn-accent"
                        style={{
                            fontSize: '1.3rem',
                            padding: '1.2rem 2.5rem',
                            textDecoration: 'none',
                            boxShadow: '0 4px 15px rgba(217, 119, 6, 0.3)'
                        }}
                    >
                        🚀 Begin Training
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
