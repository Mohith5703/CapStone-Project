
import campusPhoto from "../assets/home-campus.jpg";

export default function HomePage() {
  return (
    <div className="home-container">
      <div className="hero-section" style={{ backgroundImage: `url(${campusPhoto})` }}>
        <h1>IBM Employee Management System</h1>
        <p>
          Manage employees, departments, projects and roles using a modern dashboard.
        </p>
      </div>
    </div>
  );
}
