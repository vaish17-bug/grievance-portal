// This file handles all communication with our backend
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// Notifications
export const getNotifications = () => API.get('/notifications');
export const getUnreadCount = () => API.get('/notifications/unread-count');
export const markNotificationsRead = () => API.post('/notifications/mark-read');

// Auth APIs
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);

// Complaint APIs
export const submitComplaint = (formData) => API.post('/complaints', formData);
export const getMyComplaints = () => API.get('/complaints/my');
export const getAllComplaints = () => API.get('/complaints');
export const assignComplaint = (id, workerId) =>
  API.post(`/complaints/${id}/assign?workerId=${workerId}`);
export const updateComplaintStatus = (id, status, remark) =>
  API.patch(`/complaints/${id}/status?status=${status}&remark=${remark}`);
export const getWorkerTasks = () => API.get('/complaints/worker-tasks');
export const getComplaintHistory = (id) => API.get(`/complaints/${id}/history`);

// Public APIs
export const getStats = () => API.get('/public/stats');
export const getDepartments = () => API.get('/public/departments');
export const getWorkers = () => API.get('/public/workers');