import axios from 'axios'

// curren ip address of backend save in hostiner sub domain 
// mibannana-backend = 34.125.163.160
// socket backend - 34.125.91.140
// baseURL: 'http://34.125.163.160',
// baseURL: 'http://34.125.192.152',
// baseURL: 'https://socket-dot-mi-banana-401205.uc.r.appspot.com',
// baseURL: 'https://api-dot-mi-banana-401205.uc.r.appspot.com',
// baseURL: 'https://test-vercel-amber-theta.vercel.app',

const apiClient = axios.create({
    // baseURL: process.env.REACT_APP_API_KEY,
    baseURL: 'http://localhost:8000',
    headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
});

export default apiClient
