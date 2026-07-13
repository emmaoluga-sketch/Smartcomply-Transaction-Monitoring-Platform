import apiClient from './client';

export interface Customer {
  id: number;
  name: string;
  email: string;
  country: string;
  is_high_risk: boolean;
  created_at: string;
}

export const getCustomers = (params?: any) =>
  apiClient.get<{ results: Customer[]; count: number }>('/customers/', { params });

export const getCustomer = (id: number) =>
  apiClient.get<Customer>(`/customers/${id}/`);

export const createCustomer = (data: Partial<Customer>) =>
  apiClient.post<Customer>('/customers/', data);

export const updateCustomer = (id: number, data: Partial<Customer>) =>
  apiClient.patch<Customer>(`/customers/${id}/`, data);