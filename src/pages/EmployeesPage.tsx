import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { employeeService } from "../services/employeeService";

type Employee = Record<string, any>;

const getList = (data: any): Employee[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.content)) return data.data.content;
  return [];
};

const fullName = (employee: Employee) =>
  employee.name ||
  [employee.firstName, employee.lastName].filter(Boolean).join(" ") ||
  "Unnamed Employee";

const displayValue = (value: any, fallback = "-") => {
  if (!value) return fallback;
  if (typeof value === "object") return value.name || value.departmentName || value.roleName || fallback;
  return value;
};

const getId = (employee: Employee) => employee.id || employee.employeeId || employee._id;
const isNotFoundError = (error: any) => error?.status === 404 || error?.status === 410;

export default function EmployeesPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const loadEmployees = async () => {
    const data = await employeeService.getAll();
    const list = getList(data);
    setEmployees(list);
    return list;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadEmployees();
      } catch (error) {
        console.log(error);
      }
    };

    loadData();
  }, []);

  const deleteEmployee = async (employee: Employee) => {
    const id = getId(employee);
    if (!id) {
      alert("Employee id is missing");
      return;
    }

    if (!window.confirm("Delete this employee?")) return;

    try {
      await employeeService.delete(id);
      try {
        await employeeService.getById(id);
        await loadEmployees();
        alert("Employee was not deleted from the database. Please fix the backend DELETE /employees/{id} API.");
        return;
      } catch (verifyError) {
        if (!isNotFoundError(verifyError)) {
          throw verifyError;
        }
      }

      setEmployees((current) => current.filter((item) => String(getId(item)) !== String(id)));
      alert("Employee deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete employee");
    }
  };

  const visibleEmployees = employees.filter((employee) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    return [getId(employee), fullName(employee)]
      .some((value) => String(value || "").toLowerCase().includes(query));
  });

  const openEmployee = (employee: Employee) => {
    const id = getId(employee);
    if (!id) {
      alert("Employee id is missing");
      return;
    }

    navigate(`/employees/display/${id}`);
  };

  return (
    <div>
      <main className="records-page">
        <div className="records-heading">
          <div>
            <h1>Employees</h1>
            <p>Onboard, update, and review employee records.</p>
          </div>

          <button className="primary-action" onClick={() => navigate("/employees/add")}>
            Add Employee
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
          <table className="records-table employees-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleEmployees.map((employee, index) => {
                return (
                  <tr key={getId(employee) || index}>
                    <td>
                      <button className="name-link" onClick={() => openEmployee(employee)}>
                        {fullName(employee)}
                      </button>
                    </td>
                    <td>{displayValue(employee.departmentName || employee.department)}</td>
                    <td>
                      <div className="table-actions employee-actions-cell">
                        <button className="soft-action" onClick={() => openEmployee(employee)}>
                          View
                        </button>
                        <button className="soft-action" onClick={() => navigate(`/employees/edit/${getId(employee)}`)}>
                          Edit
                        </button>
                        <button className="danger-action" onClick={() => deleteEmployee(employee)}>
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
