import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { employeeService } from "../services/employeeService";

type Employee = Record<string, any>;

const getList = (data: any): Employee[] => data?.content || data?.data || data || [];

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

  const isEmployeeStillPresent = (list: Employee[], deletedId: any) =>
    list.some((item) => String(getId(item)) === String(deletedId));

  const verifyEmployeeDeleted = async (id: any) => {
    const refreshedEmployees = await loadEmployees();
    if (isEmployeeStillPresent(refreshedEmployees, id)) {
      throw new Error("Backend still returned this employee after delete");
    }
  };

  const runDelete = async (id: any) => {
    await employeeService.delete(id);
    await verifyEmployeeDeleted(id);
  };

  const deleteEmployee = async (employee: Employee) => {
    const id = getId(employee);
    if (!id) {
      alert("Employee id is missing");
      return;
    }

    if (!window.confirm("Delete this employee?")) return;

    try {
      await runDelete(id);
      alert("Employee deleted successfully");
    } catch (error) {
      console.log(error);
      await loadEmployees().catch(console.log);
      alert("Employee was not deleted from the backend. Please check the backend DELETE /employees/{id} API.");
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
