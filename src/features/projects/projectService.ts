import apiClient from '../../api/apiClient';

export const projectService = {
  getAll: () => apiClient.get('/projects'),
  getById: (id: string) => apiClient.get(`/projects/${id}`),
  create: (data: any) => apiClient.post('/projects', data),
  update: (id: string, data: any) => apiClient.put(`/projects/${id}`, data),
  delete: (id: string) => apiClient.delete(`/projects/${id}`),
  getEmployees: (projectId: string) => apiClient.get(`/projects/${projectId}/employees`),
  assignEmployee: (projectId: string, employeeId: string) => apiClient.post(`/projects/${projectId}/employees`, { employeeId }),
  removeEmployee: (projectId: string, employeeId: string) => apiClient.delete(`/projects/${projectId}/employees/${employeeId}`),
  getByEmployee: (employeeId: string) => apiClient.get(`/projects/employee/${employeeId}`),
};
