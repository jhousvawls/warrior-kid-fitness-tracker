import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { wordpressAPI, wpUtils } from '../services/wordpressAPI';

const BlogPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                perPage: 9,
                categories: selectedCategory
            };

            const response = await wordpressAPI.getPosts(params);
            setPosts(response.posts);
            setTotalPages(response.totalPages);
        } catch (err) {
            setError('Failed to load blog posts');
            console.error(err);
            // Show mock data if WordPress isn't available
            setPosts(getMockPosts());
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [currentPage, selectedCategory]);

    useEffect(() => {
        fetchPosts();
        fetchCategories();
    }, [currentPage, selectedCategory, fetchPosts]);

    const fetchCategories = async () => {
        try {
            const cats = await wordpressAPI.getCategories();
            setCategories(cats);
        } catch (err) {
            console.log('Categories not available');
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            fetchPosts();
            return;
        }

        setLoading(true);
        try {
            const response = await wordpressAPI.searchPosts(searchQuery, 1);
            setPosts(response.posts);
            setTotalPages(response.totalPages);
            setCurrentPage(1);
        } catch (err) {
            setError('Search failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1);
        setSearchQuery('');
    };

    // Mock data for when WordPress isn't available
    const getMockPosts = () => [
        {
            id: 1,
            title: { rendered: 'Building Discipline Through Daily Exercise' },
            excerpt: { rendered: 'Learn how consistent daily exercise builds mental toughness and discipline in young warriors.' },
            slug: 'building-discipline-daily-exercise',
            date: '2024-01-15T10:00:00',
            _embedded: {
                author: [{ name: 'Warrior Coach' }]
            }
        },
        {
            id: 2,
            title: { rendered: '5 Bodyweight Exercises Every Kid Should Master' },
            excerpt: { rendered: 'Master these fundamental bodyweight movements to build a strong foundation for lifelong fitness.' },
            slug: 'bodyweight-exercises-kids-master',
            date: '2024-01-10T10:00:00',
            _embedded: {
                author: [{ name: 'Warrior Coach' }]
            }
        },
        {
            id: 3,
            title: { rendered: 'The Mental Benefits of Physical Fitness for Kids' },
            excerpt: { rendered: 'Discover how physical exercise improves focus, confidence, and emotional regulation in children.' },
            slug: 'mental-benefits-fitness-kids',
            date: '2024-01-05T10:00:00',
            _embedded: {
                author: [{ name: 'Warrior Coach' }]
            }
        }
    ];

    return (
        <div className="blog-page">
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
                        Warrior Kid Blog
                    </h1>
                    <p style={{
                        fontSize: '1.2rem',
                        opacity: '0.95',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Tips, stories, and insights to help young warriors build strength, discipline, and character.
                    </p>
                </div>
            </section>

            {/* Search and Filter Section */}
            <section className="blog-controls" style={{
                padding: '2rem',
                backgroundColor: 'var(--light-gray)',
                borderBottom: '1px solid #ddd'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{
                        display: 'flex',
                        gap: '2rem',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between'
                    }}>
                        {/* Search Form */}
                        <form onSubmit={handleSearch} style={{
                            display: 'flex',
                            gap: '0.5rem',
                            flex: '1',
                            minWidth: '300px'
                        }}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search posts..."
                                style={{
                                    flex: '1',
                                    padding: '0.75rem',
                                    border: '2px solid var(--navy-blue)',
                                    borderRadius: '8px',
                                    fontSize: '1rem'
                                }}
                            />
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                style={{ padding: '0.75rem 1.5rem' }}
                            >
                                🔍 Search
                            </button>
                        </form>

                        {/* Category Filter */}
                        {categories.length > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <label style={{ color: 'var(--navy-blue)', fontWeight: 'bold' }}>
                                    Category:
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    style={{
                                        padding: '0.75rem',
                                        border: '2px solid var(--navy-blue)',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        minWidth: '150px'
                                    }}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Blog Posts Grid */}
            <section className="blog-posts" style={{
                padding: '4rem 2rem',
                backgroundColor: 'white'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {loading && (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '4rem',
                            color: 'var(--charcoal-gray)'
                        }}>
                            <p style={{ fontSize: '1.2rem' }}>Loading posts...</p>
                        </div>
                    )}

                    {error && !posts.length && (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '4rem',
                            color: 'var(--error-red)'
                        }}>
                            <p style={{ fontSize: '1.2rem' }}>{error}</p>
                        </div>
                    )}

                    {!loading && posts.length === 0 && (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '4rem',
                            color: 'var(--charcoal-gray)'
                        }}>
                            <p style={{ fontSize: '1.2rem' }}>No posts found. Try adjusting your search or filters.</p>
                        </div>
                    )}

                    {posts.length > 0 && (
                        <>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                                gap: '2rem',
                                marginBottom: '3rem'
                            }}>
                                {posts.map(post => (
                                    <article key={post.id} className="post-card" style={{
                                        background: 'white',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                        border: '1px solid var(--light-gray)',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                                    }}
                                    >
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
                                                fontSize: '1.3rem',
                                                lineHeight: '1.4'
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
                                            
                                            {/* Post Meta */}
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

                                            {/* Categories */}
                                            {wpUtils.getCategoryNames(post).length > 0 && (
                                                <div style={{ marginBottom: '1rem' }}>
                                                    {wpUtils.getCategoryNames(post).map((category, index) => (
                                                        <span 
                                                            key={index}
                                                            style={{
                                                                display: 'inline-block',
                                                                background: 'var(--light-gray)',
                                                                color: 'var(--navy-blue)',
                                                                padding: '0.25rem 0.75rem',
                                                                borderRadius: '15px',
                                                                fontSize: '0.8rem',
                                                                marginRight: '0.5rem',
                                                                marginBottom: '0.5rem'
                                                            }}
                                                        >
                                                            {category}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <Link 
                                                to={`/blog/${post.slug}`}
                                                className="btn btn-primary"
                                                style={{
                                                    textDecoration: 'none',
                                                    fontSize: '0.9rem',
                                                    padding: '0.75rem 1.5rem',
                                                    display: 'inline-block'
                                                }}
                                            >
                                                Read More →
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="pagination" style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    marginTop: '3rem'
                                }}>
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="btn btn-secondary"
                                        style={{
                                            opacity: currentPage === 1 ? 0.5 : 1,
                                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        ← Previous
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`btn ${page === currentPage ? 'btn-primary' : 'btn-secondary'}`}
                                            style={{
                                                minWidth: '40px',
                                                fontWeight: page === currentPage ? 'bold' : 'normal'
                                            }}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="btn btn-secondary"
                                        style={{
                                            opacity: currentPage === totalPages ? 0.5 : 1,
                                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Newsletter Signup */}
            <section className="newsletter-section" style={{
                background: 'linear-gradient(135deg, var(--forest-green), var(--success-green))',
                color: 'white',
                padding: '4rem 2rem',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        marginBottom: '1rem',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                    }}>
                        Stay Updated
                    </h2>
                    <p style={{
                        fontSize: '1.2rem',
                        marginBottom: '2rem',
                        opacity: '0.95'
                    }}>
                        Get the latest fitness tips and warrior wisdom delivered to your inbox.
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        maxWidth: '400px',
                        margin: '0 auto',
                        flexWrap: 'wrap'
                    }}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            style={{
                                flex: '1',
                                padding: '1rem',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                minWidth: '250px'
                            }}
                        />
                        <button 
                            className="btn btn-accent"
                            style={{
                                padding: '1rem 2rem',
                                fontSize: '1rem',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BlogPage;
