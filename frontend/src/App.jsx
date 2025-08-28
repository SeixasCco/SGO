import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import HomePage from './pages/HomePage';
import ProjectsListPage from './pages/ProjectsListPage';
import WorkDetails from './pages/WorkDetails';
import EditWorkPage from './pages/EditWorkPage';
import EditEmployeePage from './pages/EditEmployeePage';
import EditContractPage from './pages/EditContractPage';
import EditExpensePage from './pages/EditExpensePage';
import ReportsPage from './pages/ReportsPage';
import AdminPage from './pages/AdminPage';

import { CompanyProvider } from './context/CompanyContext';
import CompanySwitcher from './components/common/CompanySwitcher';

import './App.css';

const ModernNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/projects', label: 'Obras', icon: '🏗️' },
    { path: '/admin', label: 'Administrativo', icon: '🗂️' },
    { path: '/reports', label: 'Relatórios', icon: '📋' }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="main-nav">
      <div className="main-nav-content">

        {/* LOGO/BRAND */}
        <Link to="/" className="nav-brand-link">
          <div className="nav-brand-icon">🏗️</div>
          <div>
            <div className="nav-brand-title">SGO</div>
            <div className="nav-brand-subtitle">Sistema de Gestão de Obras</div>
          </div>
        </Link>
        
        {/* Agrupamento Central: Navegação e Switcher */}
        <div className="nav-center-group">
            <div className="nav-links">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} className={`nav-link ${isActive(item.path) ? 'active' : ''}`}>
                  <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
            
            <CompanySwitcher />
        </div>

        {/* INFORMAÇÕES DO USUÁRIO/SISTEMA */}
        <div className="nav-user-info">
          <div className="user-info-text">
            <div className="name">Sistema Online</div>
            <div className="date">{new Date().toLocaleDateString('pt-BR')}</div>
          </div>
          <div className="user-avatar">👤</div>
        </div>
      </div>
    </nav>
  );
};

const AppLayout = () => {
  return (
    <div className="App">
      <ModernNavigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <Router>
        <CompanyProvider>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route path="projects" element={<ProjectsListPage />} />
              <Route path="project/:id" element={<WorkDetails />} />
              <Route path="project/edit/:id" element={<EditWorkPage />} />
              <Route path="admin" element={<AdminPage />} />
              <Route path="employee/edit/:id" element={<EditEmployeePage />} />
              <Route path="contract/edit/:id" element={<EditContractPage />} />
              <Route path="expense/edit/:id" element={<EditExpensePage />} />
              <Route path="reports" element={<ReportsPage />} />
            </Route>
          </Routes>
        </CompanyProvider>
      </Router >
    </>
  );
}

export default App;