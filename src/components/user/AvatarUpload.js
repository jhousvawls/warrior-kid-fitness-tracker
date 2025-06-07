import React, { useState, useRef } from 'react';

const AvatarUpload = ({ userId, currentAvatar, onAvatarUpdate, onCancel }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Handle file selection
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            processFile(file);
        }
    };

    // Process selected file
    const processFile = (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file (JPG, PNG, or WebP)');
            return;
        }

        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            alert('File size must be less than 2MB');
            return;
        }

        setSelectedFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    // Start camera
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: 'user', // Front camera
                    width: { ideal: 640 },
                    height: { ideal: 640 }
                }
            });
            
            setCameraStream(stream);
            setShowCamera(true);
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Unable to access camera. Please check permissions or use file upload instead.');
        }
    };

    // Stop camera
    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
        setShowCamera(false);
    };

    // Capture photo from camera
    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Set canvas size to square
        const size = Math.min(video.videoWidth, video.videoHeight);
        canvas.width = size;
        canvas.height = size;

        // Calculate crop position for center square
        const startX = (video.videoWidth - size) / 2;
        const startY = (video.videoHeight - size) / 2;

        // Draw cropped image
        context.drawImage(video, startX, startY, size, size, 0, 0, size, size);

        // Convert to blob
        canvas.toBlob((blob) => {
            const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
            processFile(file);
            stopCamera();
        }, 'image/jpeg', 0.8);
    };

    // Upload avatar
    const uploadAvatar = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('avatar', selectedFile);

            const response = await fetch(
                `https://fitness4.wpenginepowered.com/wp-json/warrior-kid/v1/user/${userId}/avatar/upload`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status}`);
            }

            const result = await response.json();
            console.log('Avatar uploaded successfully:', result);

            // Update parent component
            onAvatarUpdate(result.urls);
            
            // Reset state
            setSelectedFile(null);
            setPreview(null);
            
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Failed to upload avatar. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    // Reset selection
    const resetSelection = () => {
        setSelectedFile(null);
        setPreview(null);
        stopCamera();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="avatar-upload-container" style={{
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
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--navy-blue)' }}>
                    📸 Add Your Warrior Photo
                </h2>

                {!showCamera && !preview && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <button
                                onClick={startCamera}
                                className="btn btn-primary"
                                style={{ 
                                    width: '100%', 
                                    marginBottom: '1rem',
                                    padding: '1rem',
                                    fontSize: '1.1rem'
                                }}
                            >
                                📷 Take Photo
                            </button>
                            
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="btn btn-secondary"
                                style={{ 
                                    width: '100%',
                                    padding: '1rem',
                                    fontSize: '1.1rem'
                                }}
                            >
                                📁 Upload from Gallery
                            </button>
                            
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                            />
                        </div>
                        
                        <button
                            onClick={onCancel}
                            className="btn btn-secondary"
                            style={{ fontSize: '0.9rem' }}
                        >
                            Skip for Now
                        </button>
                    </div>
                )}

                {showCamera && (
                    <div style={{ textAlign: 'center' }}>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            style={{
                                width: '100%',
                                maxWidth: '300px',
                                borderRadius: '8px',
                                marginBottom: '1rem'
                            }}
                        />
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                        
                        <div>
                            <button
                                onClick={capturePhoto}
                                className="btn btn-primary"
                                style={{ marginRight: '1rem' }}
                            >
                                📸 Capture
                            </button>
                            <button
                                onClick={stopCamera}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {preview && (
                    <div style={{ textAlign: 'center' }}>
                        <img
                            src={preview}
                            alt="Avatar preview"
                            style={{
                                width: '200px',
                                height: '200px',
                                objectFit: 'cover',
                                borderRadius: '50%',
                                marginBottom: '1.5rem',
                                border: '3px solid var(--navy-blue)'
                            }}
                        />
                        
                        <div>
                            <button
                                onClick={uploadAvatar}
                                disabled={uploading}
                                className="btn btn-primary"
                                style={{ 
                                    marginRight: '1rem',
                                    opacity: uploading ? 0.6 : 1
                                }}
                            >
                                {uploading ? '⏳ Uploading...' : '✅ Use This Photo'}
                            </button>
                            <button
                                onClick={resetSelection}
                                disabled={uploading}
                                className="btn btn-secondary"
                            >
                                🔄 Try Again
                            </button>
                        </div>
                    </div>
                )}

                {uploading && (
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
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📤</div>
                            <p style={{ color: 'var(--navy-blue)', fontWeight: 'bold' }}>
                                Uploading your warrior photo...
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AvatarUpload;
