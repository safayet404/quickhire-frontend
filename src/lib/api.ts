import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Jobs
export const getJobs = (params?: Record<string, string | number>) =>
  api.get('/jobs', { params });

export const getFeaturedJobs = () =>
  api.get('/jobs/featured');

export const getCategories = () =>
  api.get('/jobs/categories');

export const getJob = (id: number | string) =>
  api.get(`/jobs/${id}`);

// Admin jobs
export const createJob = (data: Record<string, unknown>) =>
  api.post('/admin/jobs', data);

export const updateJob = (id: number, data: Record<string, unknown>) =>
  api.put(`/admin/jobs/${id}`, data);

export const deleteJob = (id: number) =>
  api.delete(`/admin/jobs/${id}`);

// Applications
export const submitApplication = (data: Record<string, unknown>) =>
  api.post('/applications', data);

export const getApplications = (params?: Record<string, string | number>) =>
  api.get('/admin/applications', { params });

export const deleteApplication = (id: number) =>
  api.delete(`/admin/applications/${id}`);

export default api;
