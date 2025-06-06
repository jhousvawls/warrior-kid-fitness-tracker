import React, { useState, useEffect } from 'react';
import { wordpressAPI } from '../services/wordpressAPI';

const ContactPage = () => {
    const [pageContent, setPageContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [formStatus, setFormStatus] = useState('');

    useEffect(() => {
        const fetchContactPage = async () => {
            try {
                const page = await wordpressAPI.getPageBySlug('contact');
                setPageContent(page);
            } catch (err) {
                console.log('WordPress contact page not found, using default content');
            } finally {
                setLoading(false);
            }
        };

        fetchContactPage();
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormStatus('sending');

        // Simulate form submission - replace with actual form handler
        setTimeout(() => {
            setFormStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            
            // Reset status after 3 seconds
            setTimeout(() => {
                setFormStatus('');
            }, 3000);
        }, 1000);
    };

    // Default content if WordPress isn't available
    const defaultContent = {
        title: { rendered: 'Contact Me' },
        content: { 
            rendered: `
                <p>Have questions about the Warrior Kid Fitness Tracker? Want to share your success story? I'd love to hear from you!</p>
                
                <h3>Get in Touch</h3>
                <p>Whether you're a parent looking for more information, a young warrior with feedback, or someone interested in fitness for kids, don't hesitate to reach out.</p>
                
                <p>I typically respond to messages within 24 hours and love hearing about your fitness journey!</p>
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
        <div className="contact-page">
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
                        Let's connect and build stronger warriors together!
                    </p>
                </div>
            </section>

            {/* Content and Form Section */}
            <section className="contact-content" style={{
                padding: '4rem 2rem',
                backgroundColor: 'white'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                        gap: '4rem',
                        alignItems: 'start'
                    }}>
                        {/* Content Section */}
                        <div>
                            <div 
                                style={{
                                    color: 'var(--charcoal-gray)',
                                    fontSize: '1.1rem',
                                    lineHeight: '1.8',
                                    marginBottom: '2rem'
                                }}
                                dangerouslySetInnerHTML={{ __html: content.content.rendered }}
                            />

                            {/* Contact Info */}
                            <div className="contact-info" style={{
                                background: 'var(--light-gray)',
                                padding: '2rem',
                                borderRadius: '12px',
                                border: '2px solid var(--navy-blue)'
                            }}>
                                <h3 style={{ 
                                    color: 'var(--navy-blue)', 
                                    marginBottom: '1.5rem',
                                    fontSize: '1.5rem'
                                }}>
                                    Quick Contact Info
                                </h3>
                                
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        marginBottom: '0.5rem',
                                        color: 'var(--charcoal-gray)'
                                    }}>
                                        <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>📧</span>
                                        <strong>Email Response Time:</strong>
                                    </div>
                                    <p style={{ marginLeft: '1.7rem', color: 'var(--charcoal-gray)' }}>
                                        Usually within 24 hours
                                    </p>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        marginBottom: '0.5rem',
                                        color: 'var(--charcoal-gray)'
                                    }}>
                                        <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>💪</span>
                                        <strong>Best Topics:</strong>
                                    </div>
                                    <ul style={{ 
                                        marginLeft: '1.7rem', 
                                        color: 'var(--charcoal-gray)',
                                        listStyle: 'disc'
                                    }}>
                                        <li>Fitness questions for kids</li>
                                        <li>App feedback and suggestions</li>
                                        <li>Success stories and progress</li>
                                        <li>Technical support</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div>
                            <div className="contact-form" style={{
                                background: 'white',
                                padding: '2rem',
                                borderRadius: '12px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                border: '2px solid var(--forest-green)'
                            }}>
                                <h3 style={{ 
                                    color: 'var(--forest-green)', 
                                    marginBottom: '1.5rem',
                                    fontSize: '1.5rem'
                                }}>
                                    Send a Message
                                </h3>

                                {formStatus === 'success' && (
                                    <div style={{
                                        background: 'var(--success-green)',
                                        color: 'white',
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        marginBottom: '1.5rem',
                                        textAlign: 'center'
                                    }}>
                                        ✅ Message sent successfully! I'll get back to you soon.
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                        <label htmlFor="name" style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            color: 'var(--navy-blue)',
                                            fontWeight: 'bold'
                                        }}>
                                            Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                border: '2px solid var(--light-gray)',
                                                borderRadius: '8px',
                                                fontSize: '1rem',
                                                boxSizing: 'border-box'
                                            }}
                                            placeholder="Your name"
                                        />
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                        <label htmlFor="email" style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            color: 'var(--navy-blue)',
                                            fontWeight: 'bold'
                                        }}>
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                border: '2px solid var(--light-gray)',
                                                borderRadius: '8px',
                                                fontSize: '1rem',
                                                boxSizing: 'border-box'
                                            }}
                                            placeholder="your.email@example.com"
                                        />
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                        <label htmlFor="subject" style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            color: 'var(--navy-blue)',
                                            fontWeight: 'bold'
                                        }}>
                                            Subject *
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                border: '2px solid var(--light-gray)',
                                                borderRadius: '8px',
                                                fontSize: '1rem',
                                                boxSizing: 'border-box'
                                            }}
                                            placeholder="What's this about?"
                                        />
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                                        <label htmlFor="message" style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            color: 'var(--navy-blue)',
                                            fontWeight: 'bold'
                                        }}>
                                            Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows="5"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                border: '2px solid var(--light-gray)',
                                                borderRadius: '8px',
                                                fontSize: '1rem',
                                                boxSizing: 'border-box',
                                                resize: 'vertical'
                                            }}
                                            placeholder="Tell me what's on your mind..."
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={formStatus === 'sending'}
                                        style={{
                                            width: '100%',
                                            fontSize: '1.1rem',
                                            padding: '1rem',
                                            opacity: formStatus === 'sending' ? 0.7 : 1
                                        }}
                                    >
                                        {formStatus === 'sending' ? '📤 Sending...' : '🚀 Send Message'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section" style={{
                padding: '4rem 2rem',
                backgroundColor: 'var(--light-gray)'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{
                        textAlign: 'center',
                        fontSize: '2.5rem',
                        color: 'var(--navy-blue)',
                        marginBottom: '3rem'
                    }}>
                        Frequently Asked Questions
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="faq-item" style={{
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                        }}>
                            <h4 style={{ color: 'var(--navy-blue)', marginBottom: '0.5rem' }}>
                                Is the app really free to use?
                            </h4>
                            <p style={{ color: 'var(--charcoal-gray)', margin: 0 }}>
                                Yes! The Warrior Kid Fitness Tracker is completely free. No hidden fees, no subscriptions, just pure fitness fun for kids.
                            </p>
                        </div>

                        <div className="faq-item" style={{
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                        }}>
                            <h4 style={{ color: 'var(--navy-blue)', marginBottom: '0.5rem' }}>
                                What ages is this appropriate for?
                            </h4>
                            <p style={{ color: 'var(--charcoal-gray)', margin: 0 }}>
                                The app is designed for kids aged 5-18. Exercises are bodyweight-based and can be modified for different fitness levels.
                            </p>
                        </div>

                        <div className="faq-item" style={{
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                        }}>
                            <h4 style={{ color: 'var(--navy-blue)', marginBottom: '0.5rem' }}>
                                Do I need any equipment?
                            </h4>
                            <p style={{ color: 'var(--charcoal-gray)', margin: 0 }}>
                                Nope! All exercises are bodyweight-based and can be done anywhere with just a small space to move around.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
