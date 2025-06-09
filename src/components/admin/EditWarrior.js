import React, { useState } from 'react';
import { storage } from '../../utils/localStorage';
import AvatarDisplay from '../user/AvatarDisplay';
import AvatarUpload from '../user/AvatarUpload';

const EditWarrior = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: user.name || '',
        age: user.age || '',
        password: ''
    });
    const [showAvatarUpload, setShowAvatarUpload] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        if (!formData.name.trim() || !formData.age) {
            alert('Please fill in all required fields.');
            return;
        }

        setSaving(true);
        try {
            const updatedUser = {
                ...user,
                name: formData.name.trim(),
                age: parseInt(formData.age),
                ...(formData.password && { password: formData.password })
            };

            // Save user using storage service
            await storage.saveUser(updatedUser);
            
            console.log('✅ Warrior updated:', updatedUser.name);
            onSave(updatedUser);
        } catch (error) {
            console.error('Error updating warrior:', error);
            alert('Failed to update warrior. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarUpdate = () => {
        setShowAvatarUpload(false);
        console.log('Avatar updated for warrior:', user.name);
    };

    const handleAvatarCancel = () => {
        setShowAvatarUpload(false);
    };

    const resetPassword = () => {
        const newPassword = prompt(`Enter new password for ${user.name}:`);
        if (newPassword && newPassword.length >= 6) {
            setFormData({
                ...formData,
                password: newPassword
            });
            alert('Password updated. Click Save to apply changes.');
        } else if (newPassword) {
            alert('Password must be at least 6 characters long.');
        }
    };

    const deleteAvatar = async () => {
        const confirmDelete = window.confirm(`Remove avatar for ${user.name}?`);
        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `https://fitness4.wpenginepowered.com/wp-json/warrior-kid/v1/user/${user.id}/avatar`,
                { method: 'DELETE' }
            );

            if (response.ok) {
                alert('Avatar removed successfully.');
            } else {
                throw new Error('Failed to delete avatar');
            }
        } catch (error) {
            console.error('Error deleting avatar:', error);
            alert('Failed to remove avatar. Please try again.');
        }
    };

    // Show avatar upload modal
    if (showAvatarUpload) {
        return (
            <AvatarUpload
                userId={user.id}
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
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{ color: 'var(--navy-blue)', margin: 0 }}>
                        ✏️ Edit Warrior: {user.name}
                    </h2>
                    <button
                        className="btn btn-secondary"
                        onClick={onCancel}
                        disabled={saving}
                    >
                        ✕ Cancel
                    </button>
                </div>

                {/* Avatar Section */}
                <div style={{ 
                    textAlign: 'center', 
                    marginBottom: '2rem',
                    padding: '1.5rem',
                    background: 'var(--light-gray)',
                    borderRadius: '8px'
                }}>
                    <h3 style={{ color: 'var(--navy-blue)', marginBottom: '1rem' }}>
                        📸 Warrior Avatar
                    </h3>
                    
                    <div style={{ marginBottom: '1rem' }}>
                        <AvatarDisplay
                            userId={user.id}
                            size="xlarge"
                            fallbackName={user.name}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowAvatarUpload(true)}
                            disabled={saving}
                        >
                            📷 Upload New Avatar
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={deleteAvatar}
                            disabled={saving}
                        >
                            🗑️ Remove Avatar
                        </button>
                    </div>
                </div>

                {/* User Info Form */}
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    <div className="form-group">
                        <label htmlFor="name">Warrior Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter warrior name"
                            required
                            disabled={saving}
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
                            placeholder="Enter age"
                            min="5"
                            max="18"
                            required
                            disabled={saving}
                        />
                    </div>

                    {/* Password Section */}
                    <div style={{ 
                        marginBottom: '1.5rem',
                        padding: '1.5rem',
                        background: 'var(--light-gray)',
                        borderRadius: '8px'
                    }}>
                        <h3 style={{ color: 'var(--navy-blue)', marginBottom: '1rem' }}>
                            🔐 Password Management
                        </h3>
                        
                        {formData.password ? (
                            <div style={{ 
                                background: '#d1fae5',
                                border: '1px solid #a7f3d0',
                                borderRadius: '6px',
                                padding: '1rem',
                                marginBottom: '1rem'
                            }}>
                                <p style={{ 
                                    color: '#065f46',
                                    fontWeight: 'bold',
                                    margin: '0 0 0.5rem 0'
                                }}>
                                    ✅ New password set
                                </p>
                                <p style={{ 
                                    color: '#047857',
                                    fontSize: '0.9rem',
                                    margin: 0
                                }}>
                                    Password will be updated when you save changes.
                                </p>
                            </div>
                        ) : (
                            <p style={{ 
                                color: 'var(--charcoal-gray)',
                                fontSize: '0.9rem',
                                marginBottom: '1rem'
                            }}>
                                Current password is hidden for security. Click below to set a new password.
                            </p>
                        )}

                        <button
                            type="button"
                            className="btn btn-accent"
                            onClick={resetPassword}
                            disabled={saving}
                            style={{ width: '100%' }}
                        >
                            🔄 Reset Password
                        </button>
                    </div>

                    {/* User Stats (Read-only) */}
                    <div style={{ 
                        marginBottom: '2rem',
                        padding: '1.5rem',
                        background: 'var(--light-gray)',
                        borderRadius: '8px'
                    }}>
                        <h3 style={{ color: 'var(--navy-blue)', marginBottom: '1rem' }}>
                            📊 Warrior Stats
                        </h3>
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                            gap: '1rem',
                            fontSize: '0.9rem'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontWeight: 'bold', color: 'var(--navy-blue)' }}>
                                    {user.totalWorkouts || 0}
                                </div>
                                <div style={{ color: 'var(--charcoal-gray)' }}>Workouts</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontWeight: 'bold', color: 'var(--forest-green)' }}>
                                    {user.screenTime || 0}m
                                </div>
                                <div style={{ color: 'var(--charcoal-gray)' }}>Screen Time</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontWeight: 'bold', color: 'var(--amber-orange)' }}>
                                    {user.totalPullups || 0}
                                </div>
                                <div style={{ color: 'var(--charcoal-gray)' }}>Pull-ups</div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onCancel}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={saving}
                            style={{
                                opacity: saving ? 0.6 : 1,
                                cursor: saving ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {saving ? '⏳ Saving...' : '✅ Save Changes'}
                        </button>
                    </div>
                </form>

                {/* Loading Overlay */}
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
                        borderRadius: '12px'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
                            <p style={{ color: 'var(--navy-blue)', fontWeight: 'bold' }}>
                                Updating warrior data...
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditWarrior;
