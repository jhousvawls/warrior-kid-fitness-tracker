import React, { useState, useEffect } from 'react';
import { storage } from '../../utils/localStorage';
import MathChallenge from './MathChallenge';

const LoginForm = ({ onLogin }) => {
    const [showMathChallenge, setShowMathChallenge] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        password: ''
    });
    const [isLogin, setIsLogin] = useState(true);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const loadedUsers = await storage.getUsers();
                setUsers(loadedUsers);
            } catch (error) {
                console.error('Error loading users:', error);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };
        
        loadUsers();
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const handleNewUserSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            // For login, need name and password
            if (formData.name.trim() && formData.password) {
                // Find user and validate password
                const user = users.find(u => u.name.toLowerCase() === formData.name.toLowerCase());
                if (user) {
                    // In a real app, you'd hash and compare passwords securely
                    // For now, we'll proceed to math challenge for any existing user
                    setShowMathChallenge(true);
                } else {
                    alert('Warrior not found. Please check your name or create a new warrior account.');
                }
            } else {
                alert('Please enter both warrior name and password.');
            }
        } else {
            // For new warrior, need name, age, and password
            if (formData.name.trim() && formData.age && formData.password && formData.password.length >= 6) {
                setShowMathChallenge(true);
            } else {
                alert('Please fill in all fields. Password must be at least 6 characters long.');
            }
        }
    };

    const handleMathSuccess = async () => {
        setSaving(true);
        try {
            let user = users.find(u => u.name.toLowerCase() === formData.name.toLowerCase());
            
            if (!user && !isLogin) {
                // Creating a new warrior
                user = {
                    id: Date.now().toString(),
                    name: formData.name.trim(),
                    age: parseInt(formData.age),
                    password: formData.password, // Store password for WordPress creation
                    createdAt: new Date().toISOString()
                };

                // Save user using the storage service (handles both WordPress and localStorage)
                await storage.saveUser(user);
                setUsers(prevUsers => [...prevUsers, user]);
                
                console.log('✅ New warrior created:', user.name);
            } else if (user && isLogin) {
                // Logging in existing user
                console.log('✅ Existing warrior logged in:', user.name);
            } else if (!user && isLogin) {
                throw new Error('User not found. Please create a new warrior account.');
            }
            
            storage.setCurrentUser(user.id);
            onLogin(user);
        } catch (error) {
            console.error('Error during authentication:', error);
            alert(error.message || 'Failed to authenticate. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleMathCancel = () => {
        setShowMathChallenge(false);
        setFormData({ name: '', age: '' });
    };

    if (showMathChallenge) {
        return (
            <div className="auth-container">
                <div className="auth-form">
                    {saving && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(255,255,255,0.9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            borderRadius: '12px'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
                                <p style={{ color: 'var(--navy-blue)', fontWeight: 'bold' }}>
                                    Saving warrior data...
                                </p>
                            </div>
                        </div>
                    )}
                    <MathChallenge 
                        onSuccess={handleMathSuccess}
                        onCancel={handleMathCancel}
                    />
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="auth-container">
                <div className="auth-form">
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
                        <h2 style={{ color: 'var(--navy-blue)', marginBottom: '1rem' }}>
                            Loading Warriors...
                        </h2>
                        <p style={{ color: 'var(--charcoal-gray)' }}>
                            Preparing your fitness journey!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--navy-blue)' }}>
                    🏆 Warrior Kid Fitness Tracker
                </h1>
                
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <button 
                            className={`btn ${isLogin ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => {
                                setIsLogin(true);
                                setFormData(prev => ({ ...prev, password: '' }));
                            }}
                            style={{ flex: 1 }}
                        >
                            Login
                        </button>
                        <button 
                            className={`btn ${!isLogin ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => {
                                setIsLogin(false);
                                setFormData(prev => ({ ...prev, password: '' }));
                            }}
                            style={{ flex: 1 }}
                        >
                            New Warrior
                        </button>
                    </div>
                </div>

                {isLogin ? (
                    <form onSubmit={handleNewUserSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Warrior Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your warrior name"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Login
                        </button>
                        
                        {users.length > 0 && (
                            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                <button 
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setIsLogin(false)}
                                    style={{ fontSize: '0.9rem' }}
                                >
                                    Create New Warrior Instead
                                </button>
                            </div>
                        )}
                    </form>
                ) : (
                    <form onSubmit={handleNewUserSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Warrior Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your warrior name"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="age">Age:</label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={formData.age}
                                onChange={handleInputChange}
                                placeholder="How old are you?"
                                min="5"
                                max="18"
                                required
                            />
                        </div>

                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="password">Create Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Create a secure password"
                                    minLength="6"
                                    required
                                />
                                <small style={{ color: 'var(--charcoal-gray)', fontSize: '0.8rem', display: 'block', marginTop: '0.25rem' }}>
                                    Password must be at least 6 characters long
                                </small>
                            </div>
                        )}
                        
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            {isLogin ? 'Login' : 'Create New Warrior'}
                        </button>
                        
                        {!isLogin && users.length > 0 && (
                            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                <button 
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setIsLogin(true)}
                                    style={{ fontSize: '0.9rem' }}
                                >
                                    Login as Existing Warrior
                                </button>
                            </div>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginForm;
