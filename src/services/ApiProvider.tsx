
import React, { createContext, useContext, ReactNode } from 'react';
import axios from 'axios';

// API base URL - this should match your backend server
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create Axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API Context type
type ApiContextType = {
  api: typeof api;
  apiUrl: string;
};

// Create context
const ApiContext = createContext<ApiContextType | undefined>(undefined);

// Provider component
interface ApiProviderProps {
  children: ReactNode;
}

const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  return (
    <ApiContext.Provider value={{ api, apiUrl: API_URL }}>
      {children}
    </ApiContext.Provider>
  );
};

// Hook for using the API context
export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

export default ApiProvider;
