import apiClient from './client';

export interface Alert {
  id: number;
  transaction: number;
  transaction_reference: string;
  rule_name: string;
  message: string;
  created_at: string;
}

export const getAlerts = (params?: any) =>
  apiClient.get<{ results: Alert[]; count: number }>('/alerts/', { params });