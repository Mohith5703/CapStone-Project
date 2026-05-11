
import { apiRequest } from "./apiService";

export const departmentService = {
  getAll: () => apiRequest("/departments"),
  getById: (id) => apiRequest(`/departments/${id}`),
  create: (data) => apiRequest("/departments", "POST", data),
  update: (id, data) => apiRequest(`/departments/${id}`, "PUT", data),
  delete: (id) => apiRequest(`/departments/${id}`, "DELETE"),
};
