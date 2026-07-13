import apiClient from './client';

export interface Transaction {
  id: number;
  reference: string;
  customer: number;
  amount: string;
  currency: string;
  transaction_type: string;
  status: string;
  risk_score: number;
  created_at: string;
  customer_name?: string;
}

export const getTransactions = (params?: any) =>
  apiClient.get<{ results: Transaction[]; count: number }>('/transactions/', { params });

export const getTransaction = (id: number) =>
  apiClient.get<Transaction>(`/transactions/${id}/`);

export const createTransaction = (data: Partial<Transaction>) =>
  apiClient.post<Transaction>('/transactions/', data);

export const updateTransaction = (id: number, data: Partial<Transaction>) =>
  apiClient.patch<Transaction>(`/transactions/${id}/`, data);

export const updateTransactionStatus = (id: number, status: string) =>
  apiClient.patch(`/transactions/${id}/update_status/`, { status });