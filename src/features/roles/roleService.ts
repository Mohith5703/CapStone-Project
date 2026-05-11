import apiClient from '../../api/apiClient';

export const roleService = {
  getAll: () => apiClient.get('/roles'),
  getById: (id: string) => apiClient.get(`/roles/${id}`),
  create: (data: any) => apiClient.post('/roles', data),
  update: (id: string, data: any) => apiClient.put(`/roles/${id}`, data),
  delete: (id: string) => apiClient.delete(`/roles/${id}`),
};
