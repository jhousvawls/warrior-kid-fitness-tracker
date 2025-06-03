import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wordpressAPI, wpUtils } from '../services/wordpressAPI';

const HomePage = () => {
    const [featuredPosts, setFeaturedPosts] = useState([]);
    const [pageContent, setPageContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHomePageData = async () => {
            try {
                // Fetch homepage content and featured posts in parallel
                const [posts, homePage] = await Promise.all([
                    wordpressAPI.getFeaturedPosts(3),
                    wordpressAPI.getPageBySlug('home')
                ]);
                setFeaturedPosts(posts);
                setPageContent(homePage);
            } catch (err) {
                setError('Failed to load page content');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHomePageData();
    }, []);

    // Default content fallbacks
    const defaultContent = {
        hero_title: '🏆 Warrior Kid Fitness Tracker',
        hero_subtitle: 'Build discipline, strength, and character through fun fitness challenges designed for young warriors aged 5-18.',
        hero_primary_button_text: '🚀 Start Training Now',
        hero_primary_button_link: '/app',
        hero_secondary_button_text: 'Learn More',
        hero_secondary_button_link: '/about',
        how_it_works_title: 'How It Works',
        how_it_works_features: [
            {
                icon: '🎯',
                title: 'Simple Login',
                description: 'Kids create their warrior profile with just a name and age. A fun math challenge keeps it secure and engaging.',
                color: 'navy-blue'
            },
            {
                icon: '💪',
                title: 'Fun Workouts',
                description: 'Complete 3 rounds of bodyweight exercises with animated guides, timers, and motivational celebrations.',
                color: 'forest-green'
            },
            {
                icon: '🏆',
                title: 'Earn Rewards',
                description: 'Earn screen time, track progress, compete on leaderboards, and watch your warrior character grow stronger.',
                color: 'amber-orange'
            }
        ],
        cta_title: 'Ready to Start Your Warrior Journey?',
        cta_description: 'Join thousands of young warriors building discipline, strength, and character through fitness.',
        cta_button_text: '🚀 Begin Training',
        cta_button_link: '/app'
    };

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
                        {wpUtils.getACFField(pageContent, 'hero_title', defaultContent.hero_title)}
                    </h1>
                    <p style={{
                        fontSize: '1.3rem',
                        marginBottom: '2rem',
                        lineHeight: '1.6',
                        opacity: '0.95'
                    }}>
                        {wpUtils.getACFField(pageContent, 'hero_subtitle', defaultContent.hero_subtitle)}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link 
                            to={wpUtils.getACFField(pageContent, 'hero_primary_button_link', defaultContent.hero_primary_button_link)} 
                            className="btn btn-accent"
                            style={{
                                fontSize: '1.2rem',
                                padding: '1rem 2rem',
                                textDecoration: 'none',
                                boxShadow: '0 4px 15px rgba(217, 119, 6, 0.3)'
                            }}
                        >
                            {wpUtils.getACFField(pageContent, 'hero_primary_button_text', defaultContent.hero_primary_button_text)}
                        </Link>
                        <Link 
                            to={wpUtils.getACFField(pageContent, 'hero_secondary_button_link', defaultContent.hero_secondary_button_link)} 
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
                            {wpUtils.getACFField(pageContent, 'hero_secondary_button_text', defaultContent.hero_secondary_button_text)}
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
                        {wpUtils.getACFField(pageContent, 'how_it_works_title', defaultContent.how_it_works_title)}
                    </h2>
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem',
                        marginBottom: '3rem'
                    }}>
                        {wpUtils.getACFRepeater(pageContent, 'how_it_works_features', defaultContent.how_it_works_features).map((feature, index) => (
                            <div key={index} className="feature-card" style={{
                                background: 'white',
                                padding: '2rem',
                                borderRadius: '12px',
                                textAlign: 'center',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                border: `2px solid var(--${feature.color})`
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
                                <h3 style={{ color: `var(--${feature.color})`, marginBottom: '1rem' }}>{feature.title}</h3>
                                <p style={{ color: 'var(--charcoal-gray)', lineHeight: '1.6' }}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
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
                        {wpUtils.getACFField(pageContent, 'cta_title', defaultContent.cta_title)}
                    </h2>
                    <p style={{
                        fontSize: '1.2rem',
                        marginBottom: '2rem',
                        opacity: '0.95'
                    }}>
                        {wpUtils.getACFField(pageContent, 'cta_description', defaultContent.cta_description)}
                    </p>
                    <Link 
                        to={wpUtils.getACFField(pageContent, 'cta_button_link', defaultContent.cta_button_link)} 
                        className="btn btn-accent"
                        style={{
                            fontSize: '1.3rem',
                            padding: '1.2rem 2.5rem',
                            textDecoration: 'none',
                            boxShadow: '0 4px 15px rgba(217, 119, 6, 0.3)'
                        }}
                    >
                        {wpUtils.getACFField(pageContent, 'cta_button_text', defaultContent.cta_button_text)}
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
