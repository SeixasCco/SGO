// Local: /src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import ProjectsListPage from './pages/ProjectsListPage'; 
import WorkDetails from './pages/WorkDetails';
import EditWorkPage from './pages/EditWorkPage';
import EditEmployeePage from './pages/EditEmployeePage';
import EditContractPage from './pages/EditContractPage';
import EditExpensePage from './pages/EditExpensePage';
import ReportsPage from './pages/ReportsPage'; 
import { Toaster } from 'react-hot-toast';
import AdminPage from './pages/AdminPage';
import EmployeesPage from './pages/EmployeesPage';

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
    <nav style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 48px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '80px'
      }}>
        
        {/* ✅ LOGO/BRAND */}
        <Link 
          to="/" 
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div style={{
            backgroundColor: '#3b82f6',
            borderRadius: '12px',
            padding: '12px',
            fontSize: '1.5rem'
          }}>
            🏗️
          </div>
          <div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#0f172a'
            }}>
              SGO
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#64748b',
              fontWeight: '500'
            }}>
              Sistema de Gestão de Obras
            </div>
          </div>
        </Link>

        {/* ✅ ITENS DE NAVEGAÇÃO */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                backgroundColor: isActive(item.path) ? '#eff6ff' : 'transparent',
                color: isActive(item.path) ? '#3b82f6' : '#64748b',
                border: isActive(item.path) ? '2px solid #bfdbfe' : '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.backgroundColor = '#f8fafc';
                  e.target.style.color = '#374151';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#64748b';
                }
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        {/* ✅ INFORMAÇÕES DO USUÁRIO/SISTEMA */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            fontSize: '0.875rem',
            color: '#64748b',
            textAlign: 'right'
          }}>
            <div style={{ fontWeight: '500' }}>Sistema Online</div>
            <div style={{ fontSize: '0.75rem' }}>
              {new Date().toLocaleDateString('pt-BR')}
            </div>
          </div>
          
          {/* Avatar do usuário */}
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#e0e7ff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            border: '2px solid #c7d2fe'
          }}>
            👤
          </div>
        </div>
      </div>
    </nav>
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
        <div className="App" style={{ 
          minHeight: '100vh',
          backgroundColor: '#f1f5f9'
        }}>
          <ModernNavigation />
          
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsListPage />} />
              <Route path="/project/:id" element={<WorkDetails />} />
              <Route path="/project/edit/:id" element={<EditWorkPage />} />
              <Route path="/admin" element={<AdminPage />} /> 
              <Route path="/employee/edit/:id" element={<EditEmployeePage />} />
              <Route path="/contract/edit/:id" element={<EditContractPage />} />
              <Route path="/expense/edit/:id" element={<EditExpensePage />} />
              <Route path="/reports" element={<ReportsPage />} /> 
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
}


export default App;