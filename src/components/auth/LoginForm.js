import React, { useState, useEffect } from 'react';
import { storage } from '../../utils/localStorage';
import MathChallenge from './MathChallenge';

const LoginForm = ({ onLogin }) => {
    const [showMathChallenge, setShowMathChallenge] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        age: ''
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

    const handleExistingUserLogin = (user) => {
        setFormData({ name: user.name, age: user.age });
        setShowMathChallenge(true);
    };

    const handleNewUserSubmit = (e) => {
        e.preventDefault();
        if (formData.name.trim() && formData.age) {
            setShowMathChallenge(true);
        }
    };

    const handleMathSuccess = async () => {
        setSaving(true);
        try {
            // Create or find user
            let user = users.find(u => u.name.toLowerCase() === formData.name.toLowerCase());
            
            if (!user) {
                user = {
                    id: Date.now().toString(),
                    name: formData.name.trim(),
                    age: parseInt(formData.age),
                    createdAt: new Date().toISOString()
                };
                await storage.saveUser(user);
            }
            
            storage.setCurrentUser(user.id);
            onLogin(user);
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Failed to save user data. Please try again.');
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
                            onClick={() => setIsLogin(true)}
                            style={{ flex: 1 }}
                        >
                            Login
                        </button>
                        <button 
                            className={`btn ${!isLogin ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setIsLogin(false)}
                            style={{ flex: 1 }}
                        >
                            New Warrior
                        </button>
                    </div>
                </div>

                {isLogin && users.length > 0 ? (
                    <div>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--navy-blue)' }}>
                            Choose Your Warrior:
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {users.map(user => (
                                <button
                                    key={user.id}
                                    className="btn btn-accent"
                                    onClick={() => handleExistingUserLogin(user)}
                                    style={{ 
                                        padding: '1rem',
                                        textAlign: 'left',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <span>{user.name}</span>
                                    <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                                        Age {user.age}
                                    </span>
                                </button>
                            ))}
                        </div>
                        
                        <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                            <button 
                                className="btn btn-secondary"
                                onClick={() => setIsLogin(false)}
                                style={{ fontSize: '0.9rem' }}
                            >
                                Create New Warrior Instead
                            </button>
                        </div>
                    </div>
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
                        
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Start Warrior Training!
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
