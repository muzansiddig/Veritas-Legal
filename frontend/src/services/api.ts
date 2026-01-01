import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Manual Retry Logic & Network Error Handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;

        // If there's no config or retry is false, reject
        if (!config || config._retry) {
            if (!error.response && !window.location.pathname.includes('/offline')) {
                // Potential network error
                window.location.href = '/offline';
            }
            return Promise.reject(error);
        }

        // Set retry flag
        config._retry = true;

        // Only retry GET requests or specific errors
        if (config.method === 'get' || error.code === 'ECONNABORTED') {
            return api(config);
        }

        return Promise.reject(error);
    }
);

export const authService = {
    login: async (email: string, password: string) => {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);
        const response = await api.post('/auth/login', formData);
        return response.data;
    },
    signup: async (userData: any) => {
        const response = await api.post('/auth/signup', userData);
        return response.data;
    },
    setupFirm: async (firmData: any) => {
        const response = await api.post('/auth/setup-firm', firmData);
        return response.data;
    },
};

export default api;
