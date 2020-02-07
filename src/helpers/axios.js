import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://dev-api.zilliqa.com/',
    timeout: 2000
  });

export default axiosInstance;