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
        hero_title: '🏆 Warrior Path Fitness',
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
            <section className="hero-section homepage-hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        {wpUtils.getACFField(pageContent, 'hero_title', defaultContent.hero_title)}
                    </h1>
                    <p className="hero-subtitle">
                        {wpUtils.getACFField(pageContent, 'hero_subtitle', defaultContent.hero_subtitle)}
                    </p>
                    <div className="hero-buttons">
                        <Link 
                            to={wpUtils.getACFField(pageContent, 'hero_primary_button_link', defaultContent.hero_primary_button_link)} 
                            className="btn btn-accent hero-btn-primary"
                        >
                            {wpUtils.getACFField(pageContent, 'hero_primary_button_text', defaultContent.hero_primary_button_text)}
                        </Link>
                        <Link 
                            to={wpUtils.getACFField(pageContent, 'hero_secondary_button_link', defaultContent.hero_secondary_button_link)} 
                            className="btn btn-secondary hero-btn-secondary"
                        >
                            {wpUtils.getACFField(pageContent, 'hero_secondary_button_text', defaultContent.hero_secondary_button_text)}
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works homepage-section">
                <div className="section-container">
                    <h2 className="section-title">
                        {wpUtils.getACFField(pageContent, 'how_it_works_title', defaultContent.how_it_works_title)}
                    </h2>
                    
                    <div className="features-grid">
                        {wpUtils.getACFRepeater(pageContent, 'how_it_works_features', defaultContent.how_it_works_features).map((feature, index) => (
                            <div key={index} className="feature-card" style={{
                                border: `2px solid var(--${feature.color})`
                            }}>
                                <div className="feature-icon">{feature.icon}</div>
                                <h3 className="feature-title" style={{ color: `var(--${feature.color})` }}>{feature.title}</h3>
                                <p className="feature-description">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Blog Posts */}
            <section className="featured-posts homepage-section">
                <div className="section-container">
                    <h2 className="section-title">
                        Latest Fitness Tips
                    </h2>

                    {loading && (
                        <div className="loading-state">
                            <p>Loading latest posts...</p>
                        </div>
                    )}

                    {error && (
                        <div className="error-state">
                            <p style={{ color: 'var(--error-red)' }}>{error}</p>
                        </div>
                    )}

                    {!loading && !error && featuredPosts.length > 0 && (
                        <div className="blog-posts-grid">
                            {featuredPosts.map(post => (
                                <article key={post.id} className="post-card">
                                    {wpUtils.getFeaturedImageUrl(post) && (
                                        <img 
                                            src={wpUtils.getFeaturedImageUrl(post)} 
                                            alt={post.title.rendered}
                                            className="post-image"
                                            loading="lazy"
                                        />
                                    )}
                                    <div className="post-content">
                                        <h3 className="post-title">
                                            {post.title.rendered}
                                        </h3>
                                        <p className="post-excerpt">
                                            {wpUtils.getCleanExcerpt(post)}
                                        </p>
                                        <div className="post-meta">
                                            <span>{wpUtils.formatDate(post.date)}</span>
                                            <span>By {wpUtils.getAuthorName(post)}</span>
                                        </div>
                                        <Link 
                                            to={`/blog/${post.slug}`}
                                            className="btn btn-primary post-btn"
                                        >
                                            Read More
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    <div className="section-cta">
                        <Link 
                            to="/blog" 
                            className="btn btn-accent"
                        >
                            View All Posts
                        </Link>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="cta-section homepage-cta">
                <div className="cta-content">
                    <h2 className="cta-title">
                        {wpUtils.getACFField(pageContent, 'cta_title', defaultContent.cta_title)}
                    </h2>
                    <p className="cta-description">
                        {wpUtils.getACFField(pageContent, 'cta_description', defaultContent.cta_description)}
                    </p>
                    <Link 
                        to={wpUtils.getACFField(pageContent, 'cta_button_link', defaultContent.cta_button_link)} 
                        className="btn btn-accent cta-button"
                    >
                        {wpUtils.getACFField(pageContent, 'cta_button_text', defaultContent.cta_button_text)}
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
