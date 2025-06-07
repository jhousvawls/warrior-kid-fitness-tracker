import React, { useState, useEffect } from 'react';

const AvatarDisplay = ({ 
    userId, 
    size = 'medium', 
    showEditButton = false, 
    onEditClick,
    fallbackName = '',
    className = ''
}) => {
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Size configurations
    const sizeConfig = {
        small: { width: '40px', height: '40px', fontSize: '1rem' },
        medium: { width: '80px', height: '80px', fontSize: '1.5rem' },
        large: { width: '120px', height: '120px', fontSize: '2rem' },
        xlarge: { width: '200px', height: '200px', fontSize: '3rem' }
    };

    const currentSize = sizeConfig[size] || sizeConfig.medium;

    // Fetch user avatar
    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchAvatar = async () => {
            try {
                const response = await fetch(
                    `https://fitness4.wpenginepowered.com/wp-json/warrior-kid/v1/user/${userId}/avatar`
                );

                if (response.ok) {
                    const data = await response.json();
                    if (data.has_avatar && data.urls) {
                        // Choose appropriate size based on component size
                        let imageUrl = data.urls.medium;
                        if (size === 'small') imageUrl = data.urls.thumbnail;
                        if (size === 'large' || size === 'xlarge') imageUrl = data.urls.large;
                        
                        setAvatarUrl(imageUrl);
                    }
                } else {
                    console.log('No avatar found for user:', userId);
                }
            } catch (error) {
                console.error('Error fetching avatar:', error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchAvatar();
    }, [userId, size]);

    // Generate initials from name
    const getInitials = (name) => {
        if (!name) return '👤';
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Handle image load error
    const handleImageError = () => {
        setError(true);
        setAvatarUrl(null);
    };

    const containerStyle = {
        position: 'relative',
        display: 'inline-block',
        ...currentSize
    };

    const avatarStyle = {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid var(--navy-blue)',
        background: 'var(--light-blue)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: currentSize.fontSize,
        fontWeight: 'bold',
        color: 'var(--navy-blue)',
        cursor: showEditButton ? 'pointer' : 'default'
    };

    const editButtonStyle = {
        position: 'absolute',
        bottom: '-5px',
        right: '-5px',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: 'var(--navy-blue)',
        color: 'white',
        border: '2px solid white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    };

    if (loading) {
        return (
            <div className={className} style={containerStyle}>
                <div style={{
                    ...avatarStyle,
                    background: '#f0f0f0',
                    color: '#999'
                }}>
                    ⏳
                </div>
            </div>
        );
    }

    return (
        <div className={className} style={containerStyle}>
            {avatarUrl && !error ? (
                <img
                    src={avatarUrl}
                    alt={`${fallbackName}'s avatar`}
                    style={avatarStyle}
                    onError={handleImageError}
                    onClick={showEditButton ? onEditClick : undefined}
                />
            ) : (
                <div 
                    style={avatarStyle}
                    onClick={showEditButton ? onEditClick : undefined}
                    title={fallbackName ? `${fallbackName}'s avatar` : 'User avatar'}
                >
                    {getInitials(fallbackName)}
                </div>
            )}
            
            {showEditButton && (
                <button
                    style={editButtonStyle}
                    onClick={onEditClick}
                    title="Edit avatar"
                >
                    ✏️
                </button>
            )}
        </div>
    );
};

export default AvatarDisplay;
