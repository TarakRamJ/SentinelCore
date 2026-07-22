import axios from 'axios';
import type { Asset, PerformanceMetric, Alert,Incident, IncidentStats } from '../types';

const API = axios.create({
  baseURL: 'http://localhost:8080',
});

const getStoredToken = () => localStorage.getItem('sentinelcore_token');

export const getStoredUserRole = () => {
  const storedRole = localStorage.getItem('sentinelcore_role');
  if (storedRole) {
    return storedRole;
  }

  const token = getStoredToken();
  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.role ?? null;
  } catch {
    return null;
  }
};

export const setAuthToken = (token: string | null, role?: string | null) => {
  if (token) {
    localStorage.setItem('sentinelcore_token', token);
    if (role) {
      localStorage.setItem('sentinelcore_role', role);
    } else {
      localStorage.removeItem('sentinelcore_role');
    }
  } else {
    localStorage.removeItem('sentinelcore_token');
    localStorage.removeItem('sentinelcore_role');
  }
};

export const clearAuthToken = () => {
  setAuthToken(null);
};

API.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthToken();
    }
    return Promise.reject(error);
  },
);

export interface LoginResponse {
  token: string;
  role: 'ADMIN' | 'EMPLOYEE';
  username: string;        
}

export const loginUser = async (credentials: { username: string; password: string }) => {
  const response = await API.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (payload: { username: string; email: string; password: string }) => {
  const response = await API.post('/auth/register', payload);
  return response.data;
};

export const getAssets = async (): Promise<Asset[]> => {
  const response = await API.get('/api/v1/assets');
  return response.data;
};

export const getAssetsByIpPrefix = async (prefix: string): Promise<Asset[]> => {
  const response = await API.get('/api/v1/assets/find', {
    params: { prefix },
  });
  return response.data;
};

export const createAsset = async (asset: Partial<Asset>): Promise<Asset> => {
  const response = await API.post('/api/v1/assets', asset);
  return response.data;
};

export const getMetrics = async (): Promise<PerformanceMetric[]> => {
  const response = await API.get('/api/metrics');
  return response.data;
};

export const getAlerts = async (): Promise<Alert[]> => {
  const response = await API.get('/api/alerts');
  return response.data;
};

//Milestone 2

export const getIncidents = async (): Promise<Incident[]> => {
  const response = await API.get('/api/incidents');
  return response.data;
};

export const getIncidentStats = async (): Promise<IncidentStats> => {
  const response = await API.get('/api/incidents/stats');
  return response.data;
};

export const updateIncidentStatus = async (id: string, status: string): Promise<Incident> => {
  const response = await API.put(`/api/incidents/${id}/status?status=${status}`);
  return response.data;
};