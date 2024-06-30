import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001', // Thay thế bằng URL của BE của bạn
});

export const signup = (userData: any) => API.post('/signup', userData);
export const signin = (userData: any) => API.post('/signin', userData);
