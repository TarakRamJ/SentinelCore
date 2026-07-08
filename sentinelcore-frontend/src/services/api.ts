import axios from 'axios';
import type { Asset, PerformanceMetric, Alert } from '../types';

const API = axios.create({
  baseURL: 'http://localhost:8080/api', // Points directly to your AssetController backend
});

export const getAssets = async (): Promise<Asset[]> => {
  const response = await API.get('/v1/assets');
  return response.data;
};

export const createAsset = async (asset: Partial<Asset>): Promise<Asset> => {
  const response = await API.post('/v1/assets', asset);
  return response.data;
};

export const getMetrics = async (): Promise<PerformanceMetric[]> => {
  const response = await API.get('/metrics');
  return response.data;
};

export const getAlerts = async (): Promise<Alert[]> => {
  const response = await API.get('/alerts');
  return response.data;
};