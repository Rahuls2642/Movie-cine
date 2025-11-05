// src/api/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://movie-cine-frontend.onrender.com/api",// backend URL
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
