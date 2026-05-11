
import { useNavigate } from "react-router-dom";

export default function DashboardPage(){
 const navigate = useNavigate();

 return(
  <div>
   <div className="dashboard-container">

    <h1>IBM Employee Management Dashboard</h1>

    <div className="dashboard-grid">

      <button className="card-box dashboard-card-btn" onClick={() => navigate("/employees")}>
        <h2>Employees</h2>
        <p>Manage employee records</p>
      </button>

      <button className="card-box dashboard-card-btn" onClick={() => navigate("/departments")}>
        <h2>Departments</h2>
        <p>Manage departments</p>
      </button>

      <button className="card-box dashboard-card-btn" onClick={() => navigate("/projects")}>
        <h2>Projects</h2>
        <p>Manage projects</p>
      </button>

      <button className="card-box dashboard-card-btn" onClick={() => navigate("/roles")}>
        <h2>Roles</h2>
        <p>Manage employee roles</p>
      </button>

    </div>

   </div>

  </div>
 )
}
