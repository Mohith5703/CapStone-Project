
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ibmLogo from "../assets/ibm.svg";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem("token")));

  useEffect(() => {
    const syncAuthState = () => setIsLoggedIn(Boolean(localStorage.getItem("token")));

    window.addEventListener("storage", syncAuthState);
    window.addEventListener("auth-change", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("auth-change", syncAuthState);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="logo-section" onClick={() => navigate("/dashboard")}>
        <img
          src={ibmLogo}
          alt="IBM"
          className="logo"
        />
      </div>

      <div className="nav-links">
        {isLoggedIn ? (
          <>
            <Link to="/employees">Employees</Link>
            <Link to="/departments">Departments</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/roles">Roles</Link>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <button className="logout-btn login-nav-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>
    </div>
  );
}
