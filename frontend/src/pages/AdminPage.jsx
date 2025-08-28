import React, { useState } from 'react';
import EmployeesPage from './EmployeesPage';
import AdminExpensesPage from './AdminExpensesPage';
import CompanyProfilePage from './CompanyProfilePage';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('employees');

    const tabs = [
        { id: 'employees', label: '👥 Gestão de Funcionários' },
        { id: 'expenses', label: '💰 Despesas da Matriz' },
        { id: 'company', label: '🏢 Dados da Matriz' }
    ];

    return (
        <div className="page-container">
            {/* Header da Página */}
            <div className="page-header">
                <div className="page-header-content">
                    <div>
                        <h1 className="page-title">🗂️ Módulo Administrativo</h1>
                        <p className="page-subtitle">
                            Gestão centralizada de funcionários, despesas e dados da empresa.
                        </p>
                    </div>
                </div>
            </div>
           
            <div className="tabs-navigation-container">
                <div className="tabs-navigation">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`tab-button ${activeTab === tab.id ? 'tab-button-active' : ''}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
           
            <div className="page-content" style={{ paddingTop: '32px' }}>
                <div className="tab-content-full">
                    {activeTab === 'employees' && <EmployeesPage />}
                    {activeTab === 'expenses' && <AdminExpensesPage />}
                    {activeTab === 'company' && <CompanyProfilePage />}
                </div>
            </div>
            
        </div>
    );
};

export default AdminPage;
