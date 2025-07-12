import axios from 'axios';
import { setAlert } from '../store/actions/alertActions';
import store from '../store';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000 // 30 seconds timeout
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            
            // Show loading state
            store.dispatch(setAlert({ message: 'Loading...', type: 'info' }));
            
            return config;
        } catch (error) {
            console.error('Request interceptor error:', error);
            return Promise.reject({
                message: 'Failed to prepare request',
                error
            });
        }
    },
    (error) => {
        console.error('Request error:', error);
        store.dispatch(setAlert({
            message: 'Request failed. Please try again.',
            type: 'error'
        }));
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => {
        // Clear loading state
        store.dispatch(setAlert(null));
        return response;
    },
    (error) => {
        const { response } = error;
        
        // Clear loading state
        store.dispatch(setAlert(null));

        if (response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const errorMessage = response.data?.message || 'An error occurred';
            
            // Handle specific error codes
            switch (response.status) {
                case 401:
                    // Handle unauthorized
                    store.dispatch(setAlert({
                        message: 'Session expired. Please login again.',
                        type: 'error'
                    }));
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    break;
                case 403:
                    // Handle forbidden
                    store.dispatch(setAlert({
                        message: 'You don't have permission to access this resource.',
                        type: 'error'
                    }));
                    break;
                case 404:
                    store.dispatch(setAlert({
                        message: 'Resource not found.',
                        type: 'error'
                    }));
                    break;
                default:
                    store.dispatch(setAlert({
                        message: errorMessage,
                        type: 'error'
                    }));
            }
            
            return Promise.reject(response.data);
        } else if (error.request) {
            // The request was made but no response was received
            store.dispatch(setAlert({
                message: 'No response received from server. Please check your connection.',
                type: 'error'
            }));
            return Promise.reject({
                message: 'No response received from server',
                error
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            store.dispatch(setAlert({
                message: 'Request failed. Please try again.',
                type: 'error'
            }));
            return Promise.reject({
                message: error.message,
                error
            });
        }
    }
);

// Helper methods with error handling
api.get = async (...args) => {
    try {
        const response = await api.request({ method: 'get', ...args });
        return response.data;
    } catch (error) {
        throw error;
    }
};

api.post = async (...args) => {
    try {
        const response = await api.request({ method: 'post', ...args });
        return response.data;
    } catch (error) {
        throw error;
    }
};

api.put = async (...args) => {
    try {
        const response = await api.request({ method: 'put', ...args });
        return response.data;
    } catch (error) {
        throw error;
    }
};

api.delete = async (...args) => {
    try {
        const response = await api.request({ method: 'delete', ...args });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default api;
