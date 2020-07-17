import axios from 'axios';

const api = axios.create({
  baseURL: `http://${require('../scenes/ip').default}:3516/`
});

export default api;
