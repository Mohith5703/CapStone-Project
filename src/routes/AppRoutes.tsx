import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../features/auth/context/AuthContext';
import LoginPage from '../features/auth/pages/LoginPage';
import EmployeesPage from '../features/employees/pages/EmployeesPage';
import DepartmentsPage from '../features/departments/DepartmentsPage';
import ProjectsPage from '../features/projects/ProjectsPage';
import RolesPage from '../features/roles/RolesPage';
import Navbar from '../shared/layout/Navbar';
import Page404 from '../features/other/pages/Page404';
import type { ReactElement } from 'react';

const PrivateRoute = ({ element }: { element: ReactElement }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#161616', color: '#8d8d8d', fontFamily: 'IBM Plex Sans, sans-serif' }}>
      Loading...
    </div>
  );
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/employees" replace />} />
        <Route path="/employees" element={<PrivateRoute element={<EmployeesPage />} />} />
        <Route path="/departments" element={<PrivateRoute element={<DepartmentsPage />} />} />
        <Route path="/projects" element={<PrivateRoute element={<ProjectsPage />} />} />
        <Route path="/roles" element={<PrivateRoute element={<RolesPage />} />} />
        <Route path="/*" element={<Page404 />} />
      </Routes>
    </>
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
