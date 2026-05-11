
import { useNavigate } from "react-router-dom";

export default function DashboardPage(){
 const navigate = useNavigate();

 const cards = [
   { title: "Employees", desc: "Manage employee records", icon: "👥", color: "#0f62fe" },
   { title: "Departments", desc: "Manage departments", icon: "🏢", color: "#24a148" },
   { title: "Projects", desc: "Manage projects", icon: "📊", color: "#f1c21b" },
   { title: "Roles", desc: "Manage employee roles", icon: "👔", color: "#da1e28" },
 ];

 return(
  <div>
   <div className="dashboard-container">

    <h1>IBM Employee Management Dashboard</h1>

    <div className="dashboard-grid">

      {cards.map((card, idx) => (
        <button 
          key={idx}
          className="card-box dashboard-card-btn" 
          onClick={() => navigate(`/${card.title.toLowerCase()}`)}
          style={{ borderLeft: `5px solid ${card.color}` }}
        >
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>{card.icon}</div>
          <h2 style={{ marginBottom: "8px" }}>{card.title}</h2>
          <p>{card.desc}</p>
        </button>
      ))}

    </div>

   </div>

  </div>
 )
}
