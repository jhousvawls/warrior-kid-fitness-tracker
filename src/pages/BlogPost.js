import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { wordpressAPI, wpUtils } from '../services/wordpressAPI';

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);

    useEffect(() => {
        fetchPost();
    }, [slug]);

    const fetchPost = async () => {
        setLoading(true);
        try {
            const postData = await wordpressAPI.getPostBySlug(slug);
            setPost(postData);
            
            // Fetch related posts
            try {
                const related = await wordpressAPI.getPosts({ perPage: 3 });
                setRelatedPosts(related.posts.filter(p => p.id !== postData.id).slice(0, 3));
            } catch (err) {
                console.log('Related posts not available');
            }
        } catch (err) {
            setError('Post not found');
            console.error(err);
            // Show mock post if WordPress isn't available
            setPost(getMockPost(slug));
        } finally {
            setLoading(false);
        }
    };

    // Mock post data for when WordPress isn't available
    const getMockPost = (slug) => {
        const mockPosts = {
            'building-discipline-daily-exercise': {
                id: 1,
                title: { rendered: 'Building Discipline Through Daily Exercise' },
                content: { 
                    rendered: `
                        <p>Discipline is the foundation of all success, and there's no better way to build it than through consistent daily exercise. When young warriors commit to moving their bodies every day, they're not just building physical strength—they're forging mental toughness that will serve them in every area of life.</p>
                        
                        <h3>Why Daily Exercise Builds Discipline</h3>
                        <p>Exercise requires you to do something even when you don't feel like it. It teaches you to push through discomfort, to keep going when things get tough, and to prioritize long-term benefits over short-term comfort.</p>
                        
                        <h3>Starting Small</h3>
                        <p>You don't need to do a full workout every day to build discipline. Start with just 10 minutes of movement:</p>
                        <ul>
                            <li>10 push-ups when you wake up</li>
                            <li>A 5-minute walk around the block</li>
                            <li>Some jumping jacks during TV commercials</li>
                            <li>Stretching before bed</li>
                        </ul>
                        
                        <h3>The Compound Effect</h3>
                        <p>Small daily actions compound over time. That 10-minute morning routine becomes a habit. That habit becomes part of who you are. And that identity as someone who exercises daily spills over into other areas of your life.</p>
                        
                        <p>Remember: discipline equals freedom. The more disciplined you become with your body, the more freedom you'll have in your mind and your life.</p>
                    `
                },
                slug: 'building-discipline-daily-exercise',
                date: '2024-01-15T10:00:00',
                _embedded: {
                    author: [{ name: 'Warrior Coach' }]
                }
            },
            'bodyweight-exercises-kids-master': {
                id: 2,
                title: { rendered: '5 Bodyweight Exercises Every Kid Should Master' },
                content: { 
                    rendered: `
                        <p>Building a strong foundation starts with mastering the basics. These five bodyweight exercises will give young warriors everything they need to develop strength, coordination, and confidence.</p>
                        
                        <h3>1. Push-ups</h3>
                        <p>The king of upper body exercises. Start on your knees if needed, then progress to full push-ups. Focus on perfect form over quantity.</p>
                        
                        <h3>2. Squats</h3>
                        <p>Essential for leg strength and mobility. Sit back like you're sitting in a chair, keep your chest up, and drive through your heels to stand.</p>
                        
                        <h3>3. Planks</h3>
                        <p>Core strength is crucial for everything. Hold a straight line from head to heels, breathe normally, and build up your time gradually.</p>
                        
                        <h3>4. Burpees</h3>
                        <p>The ultimate full-body exercise. Combines strength, cardio, and mental toughness all in one movement.</p>
                        
                        <h3>5. Mountain Climbers</h3>
                        <p>Great for cardio and core strength. Start slow and focus on bringing your knees all the way to your chest.</p>
                        
                        <h3>Progression Tips</h3>
                        <ul>
                            <li>Master the form before increasing reps</li>
                            <li>Add one rep each week</li>
                            <li>Focus on quality over quantity</li>
                            <li>Listen to your body and rest when needed</li>
                        </ul>
                        
                        <p>These exercises require no equipment and can be done anywhere. Master these five, and you'll have a solid foundation for lifelong fitness.</p>
                    `
                },
                slug: 'bodyweight-exercises-kids-master',
                date: '2024-01-10T10:00:00',
                _embedded: {
                    author: [{ name: 'Warrior Coach' }]
                }
            }
        };

        return mockPosts[slug] || {
            id: 999,
            title: { rendered: 'Post Not Found' },
            content: { rendered: '<p>This post could not be found. Please check the URL or return to the blog.</p>' },
            slug: slug,
            date: new Date().toISOString(),
            _embedded: {
                author: [{ name: 'Warrior Coach' }]
            }
        };
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
                <p style={{ fontSize: '1.2rem' }}>Loading post...</p>
            </div>
        );
    }

    if (error && !post) {
        return (
            <div style={{ 
                padding: '4rem 2rem', 
                textAlign: 'center',
                minHeight: '50vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <h1 style={{ color: 'var(--navy-blue)', marginBottom: '1rem' }}>Post Not Found</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--charcoal-gray)' }}>
                    The post you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/blog" className="btn btn-primary">
                    ← Back to Blog
                </Link>
            </div>
        );
    }

    return (
        <div className="blog-post">
            {/* Breadcrumb Navigation */}
            <nav style={{
                padding: '1rem 2rem',
                backgroundColor: 'var(--light-gray)',
                borderBottom: '1px solid #ddd'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <Link 
                        to="/blog" 
                        style={{ 
                            color: 'var(--navy-blue)', 
                            textDecoration: 'none',
                            fontSize: '0.9rem'
                        }}
                    >
                        ← Back to Blog
                    </Link>
                </div>
            </nav>

            {/* Post Header */}
            <header className="post-header" style={{
                padding: '3rem 2rem',
                backgroundColor: 'white',
                borderBottom: '1px solid var(--light-gray)'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        color: 'var(--navy-blue)',
                        marginBottom: '1rem',
                        lineHeight: '1.2'
                    }}>
                        {post.title.rendered}
                    </h1>
                    
                    <div className="post-meta" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem',
                        color: 'var(--charcoal-gray)',
                        fontSize: '0.9rem',
                        marginBottom: '1rem'
                    }}>
                        <span>📅 {wpUtils.formatDate(post.date)}</span>
                        <span>✍️ By {wpUtils.getAuthorName(post)}</span>
                        <span>⏱️ 5 min read</span>
                    </div>

                    {/* Categories */}
                    {wpUtils.getCategoryNames(post).length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                            {wpUtils.getCategoryNames(post).map((category, index) => (
                                <span 
                                    key={index}
                                    style={{
                                        display: 'inline-block',
                                        background: 'var(--navy-blue)',
                                        color: 'white',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '15px',
                                        fontSize: '0.8rem',
                                        marginRight: '0.5rem'
                                    }}
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            {/* Featured Image */}
            {wpUtils.getFeaturedImageUrl(post) && (
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
                    <img 
                        src={wpUtils.getFeaturedImageUrl(post, 'large')} 
                        alt={post.title.rendered}
                        style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '12px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            marginBottom: '2rem'
                        }}
                    />
                </div>
            )}

            {/* Post Content */}
            <article className="post-content" style={{
                padding: '2rem',
                backgroundColor: 'white'
            }}>
                <div style={{ 
                    maxWidth: '800px', 
                    margin: '0 auto',
                    lineHeight: '1.8',
                    fontSize: '1.1rem'
                }}>
                    <div 
                        style={{
                            color: 'var(--charcoal-gray)'
                        }}
                        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                    />
                </div>
            </article>

            {/* Social Sharing */}
            <section className="social-sharing" style={{
                padding: '2rem',
                backgroundColor: 'var(--light-gray)',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h3 style={{ 
                        color: 'var(--navy-blue)', 
                        marginBottom: '1rem',
                        fontSize: '1.3rem'
                    }}>
                        Share This Post
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button 
                            className="btn btn-primary"
                            onClick={() => {
                                const url = window.location.href;
                                const text = `Check out this post: ${post.title.rendered}`;
                                if (navigator.share) {
                                    navigator.share({ title: post.title.rendered, url, text });
                                } else {
                                    navigator.clipboard.writeText(url);
                                    alert('Link copied to clipboard!');
                                }
                            }}
                            style={{ fontSize: '0.9rem', padding: '0.75rem 1.5rem' }}
                        >
                            📤 Share
                        </button>
                        <button 
                            className="btn btn-secondary"
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert('Link copied to clipboard!');
                            }}
                            style={{ fontSize: '0.9rem', padding: '0.75rem 1.5rem' }}
                        >
                            🔗 Copy Link
                        </button>
                    </div>
                </div>
            </section>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="related-posts" style={{
                    padding: '4rem 2rem',
                    backgroundColor: 'white'
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <h2 style={{
                            textAlign: 'center',
                            fontSize: '2rem',
                            color: 'var(--navy-blue)',
                            marginBottom: '3rem'
                        }}>
                            Related Posts
                        </h2>
                        
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '2rem'
                        }}>
                            {relatedPosts.map(relatedPost => (
                                <article key={relatedPost.id} className="related-post-card" style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                    border: '1px solid var(--light-gray)',
                                    transition: 'transform 0.3s ease'
                                }}>
                                    {wpUtils.getFeaturedImageUrl(relatedPost) && (
                                        <img 
                                            src={wpUtils.getFeaturedImageUrl(relatedPost)} 
                                            alt={relatedPost.title.rendered}
                                            style={{
                                                width: '100%',
                                                height: '150px',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    )}
                                    <div style={{ padding: '1.5rem' }}>
                                        <h4 style={{
                                            color: 'var(--navy-blue)',
                                            marginBottom: '0.5rem',
                                            fontSize: '1.1rem'
                                        }}>
                                            {relatedPost.title.rendered}
                                        </h4>
                                        <p style={{
                                            color: 'var(--charcoal-gray)',
                                            fontSize: '0.9rem',
                                            marginBottom: '1rem'
                                        }}>
                                            {wpUtils.getCleanExcerpt(relatedPost, 100)}
                                        </p>
                                        <Link 
                                            to={`/blog/${relatedPost.slug}`}
                                            className="btn btn-primary"
                                            style={{
                                                textDecoration: 'none',
                                                fontSize: '0.8rem',
                                                padding: '0.5rem 1rem'
                                            }}
                                        >
                                            Read More
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Call to Action */}
            <section className="cta-section" style={{
                background: 'linear-gradient(135deg, var(--forest-green), var(--success-green))',
                color: 'white',
                padding: '4rem 2rem',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: '2rem',
                        marginBottom: '1rem',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                    }}>
                        Ready to Start Training?
                    </h2>
                    <p style={{
                        fontSize: '1.1rem',
                        marginBottom: '2rem',
                        opacity: '0.95'
                    }}>
                        Put these tips into action with the Warrior Kid Fitness Tracker!
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link 
                            to="/app" 
                            className="btn btn-accent"
                            style={{
                                fontSize: '1.1rem',
                                padding: '1rem 2rem',
                                textDecoration: 'none',
                                boxShadow: '0 4px 15px rgba(217, 119, 6, 0.3)'
                            }}
                        >
                            🚀 Start Training
                        </Link>
                        <Link 
                            to="/blog" 
                            className="btn btn-secondary"
                            style={{
                                fontSize: '1rem',
                                padding: '1rem 2rem',
                                textDecoration: 'none',
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                border: '2px solid white',
                                color: 'white'
                            }}
                        >
                            More Posts
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BlogPost;
