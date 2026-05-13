import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <div className="welcome-panel">
        <p className="welcome-badge">Welcome to IBM EMS</p>
        <h1 className="welcome-title">Your employee lifecycle, simplified with speed and style.</h1>
        <p className="welcome-subtitle">
          A beautiful, intuitive dashboard for managing employees, departments, projects, and roles.
          Start with secure sign in and take control of your workplace data in one place.
        </p>
        <button className="welcome-button" onClick={() => navigate('/login')}>
          Get Started
        </button>
      </div>
    </div>
  );
}
