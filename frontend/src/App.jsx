// frontend/src/App.jsx - Versão atualizada com usuário no canto direito

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Outlet, Navigate } from 'react-router-dom';
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
import LoginPage from './pages/LoginPage';

import { AuthProvider } from './context/AuthContext';
import { CompanyProvider } from './context/CompanyContext';
import ProtectedRoute from './components/ProtectedRoute';
import CompanySwitcher from './components/common/CompanySwitcher';
import LogoutButton from './components/common/LogoutButton';

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
        {/* LOGO/BRAND - Esquerda */}
        <Link to="/" className="nav-brand-link">
          <div className="nav-brand-icon">🏗️</div>
          <div>
            <div className="nav-brand-title">SGO</div>
            <div className="nav-brand-subtitle">Sistema de Gestão de Obras</div>
          </div>
        </Link>
        
        {/* NAVEGAÇÃO CENTRAL */}
        <div className="nav-links-center">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        {/* GRUPO DIREITO: Empresa + Usuário + Logout */}
        <div className="nav-right-group">
          {/* Seletor de Empresa */}
          <CompanySwitcher />
          
          {/* Status "Operando em:" */}
          <div className="operating-status">
            <span style={{ 
              fontSize: '0.8rem', 
              color: '#64748b',
              fontWeight: '500' 
            }}>
              Operando em:
            </span>
          </div>

          {/* Informações do Usuário */}
          <div className="nav-user-section">
            <div className="user-info-text">
              <div className="name">Administrador</div>
              <div className="date">{new Date().toLocaleDateString('pt-BR')}</div>
            </div>
            <div className="user-avatar">👤</div>
          </div>

          {/* Botão de Logout */}
          <LogoutButton />
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
        <AuthProvider>
          <Routes>
            {/* Rota de Login (não protegida) */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Rotas Protegidas */}
            <Route path="/" element={
              <ProtectedRoute>
                <CompanyProvider>
                  <AppLayout />
                </CompanyProvider>
              </ProtectedRoute>
            }>
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

            {/* Rota padrão - redireciona para login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;