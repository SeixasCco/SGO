import React, { useState } from 'react';
import EmployeesPage from './EmployeesPage'; 
import AdminExpensesPage from './AdminExpensesPage'; 
const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('employees');

    const tabButtonStyle = (isActive) => ({
        padding: '12px 24px',
        border: 'none',
        borderBottom: isActive ? '3px solid #3b82f6' : '3px solid transparent',
        backgroundColor: 'transparent',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        color: isActive ? '#3b82f6' : '#64748b',
        transition: 'all 0.2s ease'
    });

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px' }}>
            {/* Header da Página Administrativa */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#0f172a' }}>
                    🗂️ Módulo Administrativo
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#64748b', margin: 0 }}>
                    Gestão de funcionários e despesas da matriz.
                </p>
            </div>

            {/* Navegação por Sub-abas */}
            <div style={{ borderBottom: '1px solid #e2e8f0', marginBottom: '32px' }}>
                <button 
                    style={tabButtonStyle(activeTab === 'employees')} 
                    onClick={() => setActiveTab('employees')}
                >
                    👥 Gestão de Funcionários
                </button>
                <button 
                    style={tabButtonStyle(activeTab === 'expenses')} 
                    onClick={() => setActiveTab('expenses')}
                >
                    💰 Despesas da Matriz
                </button>
            </div>

            {/* Conteúdo da Aba Ativa */}
            <div>
                {activeTab === 'employees' && <EmployeesPage />}
                {activeTab === 'expenses' && <AdminExpensesPage />}
            </div>
        </div>
    );
};

export default AdminPage;