export const setToken = (token) => {
    try {
        localStorage.setItem('token', token);
    } catch (e) {
        console.error('Failed to save token', e);
    }
};

export const getToken = () => {
    try {
        return localStorage.getItem('token');
    } catch (e) {
        console.error('Failed to get token', e);
        return null;
    }
};

export const removeToken = () => {
    try {
        localStorage.removeItem('token');
    } catch (e) {
        console.error('Failed to remove token', e);
    }
};