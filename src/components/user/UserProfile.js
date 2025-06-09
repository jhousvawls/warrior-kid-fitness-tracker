import React, { useState } from 'react';
import AvatarDisplay from './AvatarDisplay';
import AvatarUpload from './AvatarUpload';

const UserProfile = ({ user, onClose, onUserUpdate }) => {
    const [showAvatarUpload, setShowAvatarUpload] = useState(false);
    const [avatarUrls, setAvatarUrls] = useState(null);

    const handleAvatarUpdate = (urls) => {
        setAvatarUrls(urls);
        setShowAvatarUpload(false);
        
        // Update user object with new avatar
        const updatedUser = { ...user, avatarUrls: urls };
        onUserUpdate(updatedUser);
        
        console.log('Avatar updated for user:', user.name);
    };

    const handleAvatarCancel = () => {
        setShowAvatarUpload(false);
    };

    // Show avatar upload modal
    if (showAvatarUpload) {
        return (
            <AvatarUpload
                userId={user.id}
                currentAvatar={avatarUrls}
                onAvatarUpdate={handleAvatarUpdate}
                onCancel={handleAvatarCancel}
            />
        );
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2rem',
                maxWidth: '500px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto'
            }}>
                {/* Header */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{ color: 'var(--navy-blue)', margin: 0 }}>
                        👤 My Profile
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: 'var(--charcoal-gray)'
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Avatar Section */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <AvatarDisplay
                            userId={user.id}
                            size="xlarge"
                            showEditButton={true}
                            onEditClick={() => setShowAvatarUpload(true)}
                            fallbackName={user.name}
                        />
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowAvatarUpload(true)}
                        style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
                    >
                        📸 Change Photo
                    </button>
                </div>

                {/* User Info */}
                <div style={{
                    background: 'var(--light-gray)',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ 
                            display: 'block', 
                            fontWeight: 'bold', 
                            color: 'var(--navy-blue)',
                            marginBottom: '0.5rem'
                        }}>
                            Warrior Name:
                        </label>
                        <div style={{ 
                            fontSize: '1.2rem', 
                            color: 'var(--charcoal-gray)',
                            padding: '0.5rem',
                            background: 'white',
                            borderRadius: '4px'
                        }}>
                            {user.name}
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ 
                            display: 'block', 
                            fontWeight: 'bold', 
                            color: 'var(--navy-blue)',
                            marginBottom: '0.5rem'
                        }}>
                            Age:
                        </label>
                        <div style={{ 
                            fontSize: '1.2rem', 
                            color: 'var(--charcoal-gray)',
                            padding: '0.5rem',
                            background: 'white',
                            borderRadius: '4px'
                        }}>
                            {user.age} years old
                        </div>
                    </div>

                    <div>
                        <label style={{ 
                            display: 'block', 
                            fontWeight: 'bold', 
                            color: 'var(--navy-blue)',
                            marginBottom: '0.5rem'
                        }}>
                            Member Since:
                        </label>
                        <div style={{ 
                            fontSize: '1.2rem', 
                            color: 'var(--charcoal-gray)',
                            padding: '0.5rem',
                            background: 'white',
                            borderRadius: '4px'
                        }}>
                            {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    justifyContent: 'center' 
                }}>
                    <button
                        className="btn btn-secondary"
                        onClick={onClose}
                        style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
                    >
                        Close
                    </button>
                </div>

                {/* Tips */}
                <div style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                    <p style={{ 
                        color: 'var(--forest-green)',
                        margin: 0,
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        💡 <strong>Tip:</strong> Your photo will appear in the leaderboard and throughout the app!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
