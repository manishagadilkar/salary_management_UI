// src/api.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const login = (email, password) =>
  axiosInstance.post("/api/v1/login", { email, password });

export const register = (data) =>
  axiosInstance.post("/api/v1/register", data);

// Employee Endpoints
export const getEmployees = (params = {}) =>
  axiosInstance.get("/api/v1/employees", { params });

export const getEmployee = (id) => axiosInstance.get(`/api/v1/employees/${id}`);

export const createEmployee = (data) =>
  axiosInstance.post("/api/v1/employees", data);

export const updateEmployee = (id, data) =>
  axiosInstance.put(`/api/v1/employees/${id}`, data);

export const deleteEmployee = (id) =>
  axiosInstance.delete(`/api/v1/employees/${id}`);

// Salary Insights Endpoint
export const getInsights = (params = {}) =>
  axiosInstance.get("/api/v1/employees/salary_insights", { params });

export default axiosInstance;

