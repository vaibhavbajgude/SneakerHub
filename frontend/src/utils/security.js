/**
 * Simple utility for security best practices on the frontend.
 */

/**
 * Sanitize strings to prevent basic XSS
 * @param {string} str - The string to sanitize
 * @returns {string} - The sanitized string
 */
export const sanitize = (str) => {
    if (!str || typeof str !== 'string') return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return str.replace(reg, (match) => map[match]);
};

/**
 * Validates if a string is a valid email
 */
export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

/**
 * Clears sensitive data from memory/storage
 */
export const clearSensitiveData = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
};
