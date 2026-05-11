import apiClient from '../../api/apiClient';

export const departmentService = {
  getAll: () => apiClient.get('/departments'),
  getById: (id: string) => apiClient.get(`/departments/${id}`),
  create: (data: any) => apiClient.post('/departments', data),
  update: (id: string, data: any) => apiClient.put(`/departments/${id}`, data),
  delete: (id: string) => apiClient.delete(`/departments/${id}`),
};
