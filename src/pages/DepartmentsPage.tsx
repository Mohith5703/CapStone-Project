import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { departmentService } from "../services/departmentService";

type Department = Record<string, any>;

const getList = (data: any): Department[] => data?.content || data || [];
const getId = (department: Department) => department.id || department.departmentId || department._id;

export default function DepartmentsPage() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await departmentService.getAll();
        setDepartments(getList(data));
      } catch (error) {
        console.log(error);
      }
    };

    loadDepartments();
  }, []);

  const deleteDepartment = async (department: Department) => {
    const id = getId(department);
    if (!id) {
      alert("Department id is missing");
      return;
    }

    if (!window.confirm("Delete this department?")) return;

    try {
      await departmentService.delete(id);
      setDepartments((current) => current.filter((item) => getId(item) !== id));
    } catch (error) {
      console.log(error);
      alert("Failed to delete department");
    }
  };

  const visibleDepartments = departments.filter((department) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    const name = department.name || department.departmentName;
    return [getId(department), name]
      .some((value) => String(value || "").toLowerCase().includes(query));
  });

  return (
    <div>
      <main className="records-page">
        <div className="records-heading">
          <div>
            <h1>Departments</h1>
            <p>Maintain organization departments.</p>
          </div>

          <button className="primary-action" onClick={() => navigate("/departments/add")}>
            Add Department
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

        <div className="records-table-wrap">
          <table className="records-table departments-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleDepartments.map((department, index) => (
                <tr key={getId(department) || index}>
                  <td>{department.name || department.departmentName || "Unnamed Department"}</td>
                  <td>{department.description || "-"}</td>
                  <td>
                    <div className="table-actions">
                      <button className="soft-action" onClick={() => navigate(`/departments/edit/${getId(department)}`)}>
                        Edit
                      </button>
                      <button className="danger-action" onClick={() => deleteDepartment(department)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
