import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../utils/authUtils';

interface Alarm {
  _id: string;
  alarmName: string;
  time: string;
  days: string[];
  isActive: boolean;
  puzzleType: 'math' | 'memory' | 'pattern';
  puzzleDifficulty: 'easy' | 'medium' | 'hard';
  alarmTone: 'gentle' | 'nature' | 'classic' | 'energetic';
  maxSnooze: number;
  vibration: boolean;
  createdAt: string;
}

interface AlarmContextType {
  alarms: Alarm[];
  loading: boolean;
  error: string | null;
  createAlarm: (alarmData: Partial<Alarm>) => Promise<void>;
  updateAlarm: (id: string, alarmData: Partial<Alarm>) => Promise<void>;
  deleteAlarm: (id: string) => Promise<void>;
  toggleAlarm: (id: string) => Promise<void>;
  fetchAlarms: () => Promise<void>;
  clearError: () => void;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export const AlarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAlarms = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/alarms`);
      if (response.data.success) {
        setAlarms(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch alarms');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createAlarm = async (alarmData: Partial<Alarm>) => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/alarms`, alarmData);
      if (response.data.success) {
        setAlarms(prev => [response.data.data, ...prev]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create alarm');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAlarm = async (id: string, alarmData: Partial<Alarm>) => {
    setLoading(true);
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/alarms/${id}`, alarmData);
      if (response.data.success) {
        setAlarms(prev => prev.map(alarm => 
          alarm._id === id ? response.data.data : alarm
        ));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update alarm');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAlarm = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/alarms/${id}`);
      setAlarms(prev => prev.filter(alarm => alarm._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete alarm');
      throw err;
    }
  };

  const toggleAlarm = async (id: string) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/alarms/${id}/toggle`);
      if (response.data.success) {
        setAlarms(prev => prev.map(alarm => 
          alarm._id === id ? response.data.data : alarm
        ));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle alarm');
      throw err;
    }
  };

  const clearError = () => setError(null);

  const value: AlarmContextType = {
    alarms,
    loading,
    error,
    createAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarm,
    fetchAlarms,
    clearError,
  };

  return <AlarmContext.Provider value={value}>{children}</AlarmContext.Provider>;
};

export const useAlarm = (): AlarmContextType => {
  const context = useContext(AlarmContext);
  if (context === undefined) {
    throw new Error('useAlarm must be used within an AlarmProvider');
  }
  return context;
};
