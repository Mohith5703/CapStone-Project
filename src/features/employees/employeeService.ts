import apiClient from '../../api/apiClient';

export const employeeService = {

  getAll: (page = 0, size = 10, sort = 'lastName,asc') => {
    return apiClient.get('/employees', {
      params: { page, size, sort }
    });
  },

  getById: (id: string) => {
    return apiClient.get(`/employees/${id}`);
  },

  create: (data: any) => {
    return apiClient.post('/employees', data);
  },

  update: (id: string, data: any) => {
    return apiClient.put(`/employees/${id}`, data);
  },

  delete: (id: string) => {
    return apiClient.delete(`/employees/${id}`);
  },

  search: (name: string) => {
    return apiClient.get('/employees/search', {
      params: { name }
    });
  },

  getByDepartment: (deptId: string) => {
    return apiClient.get(`/employees/department/${deptId}`);
  }
};