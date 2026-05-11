
import { apiRequest } from "./apiService";

export const employeeService = {
  getAll: () => apiRequest("/employees"),
  getById: (id) => apiRequest(`/employees/${id}`),
  create: (data) => apiRequest("/employees", "POST", data),
  update: (id, data) => apiRequest(`/employees/${id}`, "PUT", data),
  delete: (id) => apiRequest(`/employees/${id}`, "DELETE"),
};
