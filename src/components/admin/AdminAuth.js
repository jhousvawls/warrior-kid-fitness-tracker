import React, { useState } from 'react';

const AdminAuth = ({ onAuthenticated }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Simple admin password - you can change this
    const ADMIN_PASSWORD = 'warrior2024';

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (password === ADMIN_PASSWORD) {
            onAuthenticated();
        } else {
            setError('Incorrect password. Please try again.');
            setPassword('');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--navy-blue)' }}>
                    🛠️ Admin Access
                </h1>
                
                <p style={{ 
                    textAlign: 'center', 
                    color: 'var(--charcoal-gray)', 
                    marginBottom: '2rem' 
                }}>
                    Enter the admin password to access the management panel
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="password">Admin Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter admin password"
                            autoFocus
                            required
                        />
                    </div>
                    
                    {error && (
                        <div style={{ 
                            color: 'var(--warning-red)', 
                            marginBottom: '1rem',
                            textAlign: 'center',
                            fontSize: '0.9rem'
                        }}>
                            {error}
                        </div>
                    )}
                    
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Access Admin Panel
                    </button>
                </form>

                <div style={{ 
                    marginTop: '2rem', 
                    padding: '1rem',
                    background: 'var(--light-gray)',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: 'var(--charcoal-gray)'
                }}>
                    <p style={{ margin: 0, textAlign: 'center' }}>
                        <strong>Default Password:</strong> warrior2024<br/>
                        (Change this in AdminAuth.js for production)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminAuth;
