
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

import EmployeesPage from "./pages/EmployeesPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import ProjectsPage from "./pages/ProjectsPage";
import RolesPage from "./pages/RolesPage";

import EmployeeFormPage from "./employees/pages/EmployeeFormPage";
import EmployeeSearchPage from "./employees/pages/EmployeeSearchPage";

import DepartmentFormPage from "./departments/pages/DepartmentFormPage";
import DepartmentSearchPage from "./departments/pages/DepartmentSearchPage";

import ProjectFormPage from "./projects/pages/ProjectFormPage";
import ProjectSearchPage from "./projects/pages/ProjectSearchPage";

import RoleFormPage from "./roles/pages/RoleFormPage";
import RoleSearchPage from "./roles/pages/RoleSearchPage";


import EmployeeDisplayPage from "./employees/pages/EmployeeDisplayPage";
import DepartmentDisplayPage from "./departments/pages/DepartmentDisplayPage";
import ProjectDisplayPage from "./projects/pages/ProjectDisplayPage";
import RoleDisplayPage from "./roles/pages/RoleDisplayPage";

import "./index.css";
import Navbar from "./components/Navbar";
import BackButton from "./components/BackButton";
import ProtectedRoute from "./components/ProtectedRoute";

function AppShell() {
  const location = useLocation();
  const showBackButton = [
    "/employees",
    "/departments",
    "/projects",
    "/roles",
  ].some((path) => location.pathname.startsWith(path));

  return (
    <>
      <Navbar />
      {showBackButton && <BackButton />}

      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

        <Route path="/employees" element={<ProtectedRoute><EmployeesPage /></ProtectedRoute>} />
        <Route path="/employees/add" element={<ProtectedRoute><EmployeeFormPage /></ProtectedRoute>} />
        <Route path="/employees/edit/:id" element={<ProtectedRoute><EmployeeFormPage /></ProtectedRoute>} />
        <Route path="/employees/search" element={<ProtectedRoute><EmployeeSearchPage /></ProtectedRoute>} />

        <Route path="/departments" element={<ProtectedRoute><DepartmentsPage /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
        <Route path="/roles" element={<ProtectedRoute><RolesPage /></ProtectedRoute>} />

        <Route path="/departments/add" element={<ProtectedRoute><DepartmentFormPage /></ProtectedRoute>} />
        <Route path="/departments/edit/:id" element={<ProtectedRoute><DepartmentFormPage /></ProtectedRoute>} />
        <Route path="/departments/search" element={<ProtectedRoute><DepartmentSearchPage /></ProtectedRoute>} />

        <Route path="/projects/add" element={<ProtectedRoute><ProjectFormPage /></ProtectedRoute>} />
        <Route path="/projects/edit/:id" element={<ProtectedRoute><ProjectFormPage /></ProtectedRoute>} />
        <Route path="/projects/search" element={<ProtectedRoute><ProjectSearchPage /></ProtectedRoute>} />

        <Route path="/roles/add" element={<ProtectedRoute><RoleFormPage /></ProtectedRoute>} />
        <Route path="/roles/edit/:id" element={<ProtectedRoute><RoleFormPage /></ProtectedRoute>} />
        <Route path="/roles/search" element={<ProtectedRoute><RoleSearchPage /></ProtectedRoute>} />

        <Route path="/employees/display" element={<ProtectedRoute><EmployeeDisplayPage /></ProtectedRoute>} />
        <Route path="/employees/display/:id" element={<ProtectedRoute><EmployeeDisplayPage /></ProtectedRoute>} />
        <Route path="/departments/display" element={<ProtectedRoute><DepartmentDisplayPage /></ProtectedRoute>} />
        <Route path="/projects/display" element={<ProtectedRoute><ProjectDisplayPage /></ProtectedRoute>} />
        <Route path="/roles/display" element={<ProtectedRoute><RoleDisplayPage /></ProtectedRoute>} />

      </Routes>
    </>
  );
}

export default function App() {

  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
