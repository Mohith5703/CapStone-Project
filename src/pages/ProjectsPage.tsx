import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectService } from "../services/projectService";

type Project = Record<string, any>;

const getList = (data: any): Project[] => data?.content || data || [];
const getId = (project: Project) => project.id || project.projectId || project._id;

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await projectService.getAll();
        setProjects(getList(data));
      } catch (error) {
        console.log(error);
      }
    };

    loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesStatus = statusFilter === "All" || String(project.status || "").toUpperCase() === statusFilter;
      const name = project.name || project.projectName;
      const matchesSearch = !query || [getId(project), name]
        .some((value) => String(value || "").toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [projects, statusFilter, searchQuery]);

  const deleteProject = async (project: Project) => {
    const id = getId(project);
    if (!id) {
      alert("Project id is missing");
      return;
    }

    if (!window.confirm("Delete this project?")) return;

    try {
      await projectService.delete(id);
      setProjects((current) => current.filter((item) => getId(item) !== id));
    } catch (error) {
      console.log(error);
      alert("Failed to delete project");
    }
  };

  return (
    <div>
      <main className="records-page">
        <div className="records-heading">
          <div>
            <h1>Projects</h1>
            <p>Track project lifecycle and staffing.</p>
          </div>

          <button className="primary-action" onClick={() => navigate("/projects/add")}>
            Add Project
          </button>
        </div>

        <form className="records-search" onSubmit={(event) => {
          event.preventDefault();
          setSearchQuery(searchText);
        }}>
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search by id or name"
          />
          <button type="submit" className="primary-action">Search</button>
          <button type="button" className="soft-action" onClick={() => {
            setSearchText("");
            setSearchQuery("");
          }}>
            Clear
          </button>
        </form>

        <label className="status-filter">
          <span>Status Filter</span>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option>All</option>
            <option>ACTIVE</option>
            <option>PLANNED</option>
            <option>COMPLETED</option>
            <option>ON_HOLD</option>
          </select>
        </label>

        <div className="records-table-wrap">
          <table className="records-table projects-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProjects.map((project, index) => {
                const status = String(project.status || "ACTIVE").toUpperCase();

                return (
                  <tr key={getId(project) || index}>
                    <td>{project.name || project.projectName || "Unnamed Project"}</td>
                    <td>
                      <span className="status-pill">{status}</span>
                    </td>
                    <td>{project.description || "-"}</td>
                    <td>
                      <div className="table-actions stacked-actions">
                        <button className="soft-action" onClick={() => navigate(`/projects/edit/${getId(project)}`)}>
                          Edit
                        </button>
                        <button className="danger-action" onClick={() => deleteProject(project)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
