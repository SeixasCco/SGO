import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Importando componentes comuns
import SummaryCard from '../components/common/SummaryCard';

const HomePage = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [topProjects, setTopProjects] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Usando Promise.all para buscar dados em paralelo
                const [summaryRes, topRes, activityRes] = await Promise.all([
                    axios.get('http://localhost:5145/api/dashboard/summary'),
                    axios.get('http://localhost:5145/api/dashboard/top-projects'),
                    axios.get('http://localhost:5145/api/dashboard/recent-activity')
                ]);
                setDashboardData(summaryRes.data);
                setTopProjects(topRes.data);
                setRecentActivity(activityRes.data);
            } catch (error) {
                console.error("Erro ao carregar dashboard:", error);
                setError('Erro ao carregar dashboard');
                toast.error('Não foi possível carregar os dados do dashboard.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

    if (loading) return <div className="loading-state">Carregando dashboard...</div>;
    if (error) return <div className="error-state"><h3>{error}</h3></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-content">
                    <div>
                        <h1 className="page-title">📊 Dashboard</h1>
                        <p className="page-subtitle">Visão geral do negócio • Atualizado em {new Date().toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="page-header-actions">
                         <button onClick={() => navigate('/projects')} className="form-button">
                            🏗️ Ver Obras
                        </button>
                    </div>
                </div>
            </div>

            <div className="page-content">
                {/* Cards de Resumo */}
                {dashboardData && (
                    <div className="summary-grid">
                        <SummaryCard title="Total de Obras" value={dashboardData.totalProjects} icon="🏗️" color="blue" />
                        <SummaryCard title="Obras Ativas" value={dashboardData.activeProjects} icon="🟢" color="green" />
                        <SummaryCard title="Total Contratos" value={formatCurrency(dashboardData.totalContractsValue)} icon="📄" color="blue" />
                        <SummaryCard title="Total Despesas" value={formatCurrency(dashboardData.totalExpensesValue)} icon="💰" color="yellow" />
                        <SummaryCard title="Margem Bruta" value={formatCurrency(dashboardData.profitMargin)} icon={dashboardData.profitMargin >= 0 ? '📈' : '📉'} color={dashboardData.profitMargin >= 0 ? 'green' : 'red'} />
                        <SummaryCard title="Equipe Total" value={dashboardData.totalEmployees} icon="👥" color="purple" />
                    </div>
                )}
                
                {/* Seção Principal com Top Projetos e Atividades */}
                <div className="dashboard-main-grid">
                    <div className="card">
                        <h3 className="card-header">🏆 Top Projetos Rentáveis</h3>
                        <div className="top-projects-list">
                            {topProjects.map((project, index) => (
                                <div key={project.id} className="top-project-item">
                                    <div>
                                        <Link to={`/project/${project.id}`} className="project-link">
                                            {project.contractor} - {project.name}
                                        </Link>
                                        <div className="project-sub-info">{project.city}/{project.state}</div>
                                    </div>
                                    <div className="project-values">
                                        <span className="value-contracts">{formatCurrency(project.totalContractsValue)}</span>
                                        <span className="value-expenses">{formatCurrency(project.totalExpensesValue)}</span>
                                        <span className={`value-profit ${project.profitMargin >= 0 ? 'positive' : 'negative'}`}>
                                            {formatCurrency(project.profitMargin)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="card-header">⚡ Atividades Recentes</h3>
                        <div className="recent-activity-list">
                             {recentActivity.map((activity, index) => (
                                <div key={index} className="recent-activity-item">
                                    <div>
                                        <div className="activity-description">{activity.description}</div>
                                        <div className="activity-project">{activity.projectContractor} - {activity.projectName}</div>
                                    </div>
                                    <div className="activity-details">
                                        <div className="activity-amount">{formatCurrency(activity.amount)}</div>
                                        <div className="activity-date">{new Date(activity.activityDate).toLocaleDateString('pt-BR')}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;