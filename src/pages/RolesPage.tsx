import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { roleService } from "../services/roleService";

type Role = Record<string, any>;

const getList = (data: any): Role[] => data?.content || data || [];
const getId = (role: Role) => role.id || role.roleId || role._id;

export default function RolesPage() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await roleService.getAll();
        setRoles(getList(data));
      } catch (error) {
        console.log(error);
      }
    };

    loadRoles();
  }, []);

  const deleteRole = async (role: Role) => {
    const id = getId(role);
    if (!id) {
      alert("Role id is missing");
      return;
    }

    if (!window.confirm("Delete this role?")) return;

    try {
      await roleService.delete(id);
      setRoles((current) => current.filter((item) => getId(item) !== id));
    } catch (error) {
      console.log(error);
      alert("Failed to delete role");
    }
  };

  const visibleRoles = roles.filter((role) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    const name = role.name || role.roleName;
    return [getId(role), name]
      .some((value) => String(value || "").toLowerCase().includes(query));
  });

  return (
    <div>
      <main className="records-page">
        <div className="records-heading">
          <div>
            <h1>Roles</h1>
            <p>Manage designations and seniority levels.</p>
          </div>

          <button className="primary-action" onClick={() => navigate("/roles/add")}>
            Add Role
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
          <table className="records-table roles-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Level</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleRoles.map((role, index) => (
                <tr key={getId(role) || index}>
                  <td>{role.name || role.roleName || "Unnamed Role"}</td>
                  <td>{role.level || role.seniorityLevel || "-"}</td>
                  <td>{role.description || "-"}</td>
                  <td>
                    <div className="table-actions">
                      <button className="soft-action" onClick={() => navigate(`/roles/edit/${getId(role)}`)}>
                        Edit
                      </button>
                      <button className="danger-action" onClick={() => deleteRole(role)}>
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
