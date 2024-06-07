import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://localhost:7059',
    headers: {
        'Content-Type': 'application/json'
    }
})

export default instance;