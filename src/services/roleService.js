
import { apiRequest } from "./apiService";

export const roleService = {
  getAll: () => apiRequest("/roles"),
  getById: (id) => apiRequest(`/roles/${id}`),
  create: (data) => apiRequest("/roles", "POST", data),
  update: (id, data) => apiRequest(`/roles/${id}`, "PUT", data),
  delete: (id) => apiRequest(`/roles/${id}`, "DELETE"),
};
