import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// 🔥 FORCE TOKEN INTO EVERY REQUEST
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);

export const submitComplaint = (formData) =>
  api.post('/complaints', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

export const getMyComplaints = () => api.get('/complaints/my');
export const getAllComplaints = () => api.get('/complaints');
export const assignComplaint = (id, workerId) =>
  api.post(`/complaints/${id}/assign?workerId=${workerId}`);

export const updateComplaintStatus = (id, status, remark) =>
  api.patch(`/complaints/${id}/status?status=${status}&remark=${remark}`);

export const getWorkerTasks = () => api.get('/complaints/worker-tasks');
export const getComplaintHistory = (id) => api.get(`/complaints/${id}/history`);

export const getStats = () => api.get('/public/stats');
export const getDepartments = () => api.get('/public/departments');
export const getWorkers = () => api.get('/public/workers');

export default api;