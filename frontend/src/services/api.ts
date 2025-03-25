import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // crucial for sending cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});