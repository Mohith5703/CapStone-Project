
import { apiRequest } from "./apiService";

export const projectService = {
  getAll: () => apiRequest("/projects"),
  getById: (id) => apiRequest(`/projects/${id}`),
  create: (data) => apiRequest("/projects", "POST", data),
  update: (id, data) => apiRequest(`/projects/${id}`, "PUT", data),
  delete: (id) => apiRequest(`/projects/${id}`, "DELETE"),
};
