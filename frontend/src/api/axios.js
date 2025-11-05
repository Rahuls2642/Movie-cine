// src/api/axios.js
import axios from "axios";

const API = axios.create({
  baseURL:"https://movie-cine-backend-1.onrender.com/",
  baseURL: "http://localhost:3000/api",
  withCredentials: false,
});

// add auth token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
