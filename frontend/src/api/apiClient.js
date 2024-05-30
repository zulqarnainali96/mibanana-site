import axios from 'axios'

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_KEY,
    // baseURL: 'https://test-backend.mibanana.com',
    // baseURL: `https://api.mibanana.com`,
    // baseURL: 'https://test-backend.mibanana.com',
    // baseURL: 'http://localhost:8000',
    headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
}); 

export default apiClient
