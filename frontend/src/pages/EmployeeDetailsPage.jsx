import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

import StatusBadge from '../components/common/StatusBadge'; 
import InfoCard from '../components/common/InfoCard'; 

const EmployeeDetailsPage = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEmployeeDetails = useCallback(() => {
        axios.get(`http://localhost:5145/api/employees/${id}`)
            .then(response => {
                setEmployee(response.data);
            })
            .catch(() => {
                setError('Não foi possível carregar os dados do funcionário.');
                toast.error('Erro ao carregar os dados.');
            })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        fetchEmployeeDetails();
    }, [fetchEmployeeDetails]);

    if (loading) return <div className="loading-state">Carregando dados do funcionário...</div>;
    if (error) return <div className="error-state"><h3>{error}</h3></div>;
    if (!employee) return <div className="empty-state"><h3>Funcionário não encontrado.</h3></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-content">
                    <div>
                        <Link to="/admin" className="breadcrumb-link">
                            ← Voltar para o Módulo Administrativo
                        </Link>
                        <h1 className="page-title">👥 Detalhes do Funcionário</h1>
                        <div className="project-meta">
                             <strong>{employee.name}</strong>
                             <StatusBadge status={employee.isActive ? 'active' : 'inactive'} />
                        </div>
                    </div>
                    <Link to={`/employee/edit/${id}`} className="form-button">
                        ✏️ Editar Funcionário
                    </Link>
                </div>
            </div>

            <div className="page-content">
                <div className="card">
                     <div className="employee-header-display">
                        <div className="employee-header-avatar">👤</div>
                        <div>
                            <h2 className="employee-header-name">{employee.name}</h2>
                            <p className="employee-header-position">{employee.position}</p>
                        </div>
                    </div>

                    <h3 className="section-divider">📄 Informações Gerais</h3>
                    <div className="form-grid">
                        <InfoCard
                            title="Salário"
                            value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(employee.salary)}
                            icon="💰"
                            color="green"
                        />
                        <InfoCard
                            title="Data de Contratação"
                            value={new Date(employee.startDate).toLocaleDateString('pt-BR')}
                            icon="📅"
                            color="blue"
                        />
                         {employee.endDate && (
                            <InfoCard
                                title="Data de Desligamento"
                                value={new Date(employee.endDate).toLocaleDateString('pt-BR')}
                                icon="📅"
                                color="red"
                            />
                        )}
                    </div>
                </div>

                <div className="card">
                    <h3 className="card-header">🏗️ Alocações em Obras</h3>
                    <div className="section-body">
                        {employee.projectAllocations && employee.projectAllocations.length > 0 ? (
                            <div className="allocations-list">
                                {employee.projectAllocations.map(alloc => (
                                    <div key={alloc.id} className="allocation-item">
                                        <div className="allocation-project-name">
                                           <Link to={`/project/${alloc.projectId}`}>{alloc.projectName}</Link>
                                        </div>
                                        <div className="allocation-dates">
                                            <span>Início: {new Date(alloc.startDate).toLocaleDateString('pt-BR')}</span>
                                            <span>Fim: {alloc.endDate ? new Date(alloc.endDate).toLocaleDateString('pt-BR') : 'Ativo'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state" style={{padding: '24px 0'}}>
                                <p className="empty-state-message">Nenhuma alocação encontrada para este funcionário.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetailsPage;