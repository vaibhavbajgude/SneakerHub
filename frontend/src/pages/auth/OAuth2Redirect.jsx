import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function OAuth2Redirect() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { updateUser } = useAuth();

    const processedRef = React.useRef(false);

    useEffect(() => {
        if (processedRef.current) return;
        processedRef.current = true;

        const token = searchParams.get('token');
        const refreshToken = searchParams.get('refreshToken');
        const error = searchParams.get('error');

        if (error) {
            console.error('OAuth2 Error:', error);
            navigate('/login?error=' + encodeURIComponent(error), { replace: true });
            return;
        }

        if (token && refreshToken) {
            // Store tokens
            localStorage.setItem('accessToken', token);
            localStorage.setItem('refreshToken', refreshToken);

            // Store user info
            const userId = searchParams.get('userId');
            const email = searchParams.get('email');
            const firstName = searchParams.get('firstName');
            const lastName = searchParams.get('lastName');
            const role = searchParams.get('role');

            const user = {
                id: userId,
                email,
                firstName: firstName || '',
                lastName: lastName || '',
                role: role || 'USER'
            };

            // Update state in context
            updateUser(user);

            // Redirect to home
            setTimeout(() => {
                navigate('/', { replace: true });
            }, 100);
        } else {
            navigate('/login?error=missing_tokens', { replace: true });
        }
    }, [searchParams, navigate, updateUser]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6">
                    <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Processing Google Login...
                </h2>
                <p className="text-gray-600">Please wait while we log you in.</p>
            </div>
        </div>
    );
}

export default OAuth2Redirect;
