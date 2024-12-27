import { useEffect } from 'react';

const GoogleCallbackPage = () => {
    const handleGoogleCallback = async () => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (!code) {
            console.error('No authorization code provided.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/user/api/v1/auth/google/callback/', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Failed to handle Google callback.');
            }

            const data = await response.json();
            console.log('Callback data:', data);

            // Store tokens or proceed as necessary
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('id_token', data.id_token);
            console.log('User info:', data.user_info);

        } catch (error) {
            console.error('Error handling Google callback:', error);
        }
    };

    useEffect(() => {
        handleGoogleCallback();
    }, []);

    return <div>Processing Google Login...</div>;
};

export default GoogleCallbackPage;
