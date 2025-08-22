import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [projectsByStatus, setProjectsByStatus] = useState([]);
    const [monthlyExpenses, setMonthlyExpenses] = useState([]);
    const [topProjects, setTopProjects] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // ✅ VERSÃO DEBUG - TESTA ENDPOINTS UM POR VEZ
        const fetchDashboardData = async () => {
            try {
                console.log('Iniciando carregamento do dashboard...');
                
                // Teste endpoint por endpoint
                try {
                    console.log('Carregando summary...');
                    const summaryRes = await axios.get('http://localhost:5145/api/dashboard/summary');
                    setDashboardData(summaryRes.data);
                    console.log('Summary carregado:', summaryRes.data);
                } catch (err) {
                    console.error('Erro no summary:', err);
                    setError('Erro ao carregar resumo');
                }

                try {
                    console.log('Carregando projects-by-status...');
                    const statusRes = await axios.get('http://localhost:5145/api/dashboard/projects-by-status');
                    setProjectsByStatus(statusRes.data);
                    console.log('Projects by status carregado:', statusRes.data);
                } catch (err) {
                    console.error('Erro no projects-by-status:', err);
                    // Não para o carregamento
                }

                try {
                    console.log('Carregando monthly-expenses...');
                    const expensesRes = await axios.get('http://localhost:5145/api/dashboard/monthly-expenses');
                    setMonthlyExpenses(expensesRes.data);
                    console.log('Monthly expenses carregado:', expensesRes.data);
                } catch (err) {
                    console.error('Erro no monthly-expenses:', err);
                    // Não para o carregamento
                }

                try {
                    console.log('Carregando top-projects...');
                    const topRes = await axios.get('http://localhost:5145/api/dashboard/top-projects');
                    setTopProjects(topRes.data);
                    console.log('Top projects carregado:', topRes.data);
                } catch (err) {
                    console.error('Erro no top-projects:', err);
                    // Não para o carregamento
                }

                try {
                    console.log('Carregando recent-activity...');
                    const activityRes = await axios.get('http://localhost:5145/api/dashboard/recent-activity');
                    setRecentActivity(activityRes.data);
                    console.log('Recent activity carregado:', activityRes.data);
                } catch (err) {
                    console.error('Erro no recent-activity:', err);
                    // Não para o carregamento
                }

                try {
                    console.log('Carregando alerts...');
                    const alertsRes = await axios.get('http://localhost:5145/api/dashboard/alerts');
                    setAlerts(alertsRes.data);
                    console.log('Alerts carregado:', alertsRes.data);
                } catch (err) {
                    console.error('Erro no alerts:', err);
                    // Não para o carregamento
                }

                console.log('Dashboard carregado com sucesso!');
            } catch (error) {
                console.error("Erro geral ao carregar dashboard:", error);
                setError('Erro ao carregar dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>⏳</div>
                    <p style={{ fontSize: '1.5rem', color: '#64748b' }}>Carregando dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>❌</div>
                    <p style={{ fontSize: '1.5rem', color: '#ef4444' }}>{error}</p>
                    <button onClick={() => window.location.reload()} style={{
                        padding: '12px 24px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}>
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f1f5f9',
            padding: '0'
        }}>
            
            {/* ✅ HEADER SIMPLIFICADO */}
            <div style={{
                backgroundColor: 'white',
                borderBottom: '1px solid #e2e8f0',
                padding: '32px 48px',
                marginBottom: '32px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '3rem',
                            fontWeight: '800',
                            color: '#0f172a',
                            margin: '0 0 8px 0'
                        }}>
                            📊 Dashboard Executivo
                        </h1>
                        <p style={{
                            fontSize: '1.25rem',
                            color: '#64748b',
                            margin: 0
                        }}>
                            Visão geral do negócio • Atualizado em {new Date().toLocaleDateString('pt-BR')}
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button
                            onClick={() => navigate('/projects')}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            🏗️ Ver Obras
                        </button>
                        
                        <button
                            onClick={() => navigate('/employees')}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            👥 Funcionários
                        </button>
                    </div>
                </div>
            </div>

            {/* ✅ CONTAINER PRINCIPAL */}
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '0 48px'
            }}>

                {/* ✅ ALERTAS SIMPLES */}
                {alerts.length > 0 && (
                    <div style={{ marginBottom: '32px' }}>
                        <h3>🔔 Alertas</h3>
                        {alerts.map((alert, index) => (
                            <div key={index} style={{
                                backgroundColor: 'white',
                                padding: '16px',
                                marginBottom: '8px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0'
                            }}>
                                {alert.icon} <strong>{alert.title}:</strong> {alert.message}
                            </div>
                        ))}
                    </div>
                )}

                {/* ✅ MÉTRICAS PRINCIPAIS SIMPLIFICADAS */}
                {dashboardData && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '20px',
                        marginBottom: '32px'
                    }}>
                        
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '20px',
                            border: '1px solid #e2e8f0',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏗️</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                                {dashboardData.totalProjects}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Total de Obras</div>
                        </div>

                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '20px',
                            border: '1px solid #e2e8f0',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🟢</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
                                {dashboardData.activeProjects}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Obras Ativas</div>
                        </div>

                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '20px',
                            border: '1px solid #e2e8f0',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📄</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                                {formatCurrency(dashboardData.totalContractsValue)}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Total Contratos</div>
                        </div>

                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '20px',
                            border: '1px solid #e2e8f0',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💰</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                                {formatCurrency(dashboardData.totalExpensesValue)}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Total Despesas</div>
                        </div>

                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '20px',
                            border: '1px solid #e2e8f0',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                                {dashboardData.profitMargin >= 0 ? '📈' : '📉'}
                            </div>
                            <div style={{
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                color: dashboardData.profitMargin >= 0 ? '#10b981' : '#ef4444'
                            }}>
                                {formatCurrency(dashboardData.profitMargin)}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Margem Bruta</div>
                        </div>

                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '20px',
                            border: '1px solid #e2e8f0',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👥</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                                {dashboardData.totalEmployees}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Equipe Total</div>
                        </div>
                    </div>
                )}

                {/* ✅ TOP PROJETOS SIMPLES */}
                {topProjects.length > 0 && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '24px',
                        marginBottom: '32px',
                        border: '1px solid #e2e8f0'
                    }}>
                        <h3>🏆 Top Projetos</h3>
                        {topProjects.map((project, index) => (
                            <div key={project.id} style={{
                                padding: '12px 0',
                                borderBottom: index < topProjects.length - 1 ? '1px solid #f1f5f9' : 'none',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <Link to={`/project/${project.id}`} style={{
                                        textDecoration: 'none',
                                        color: '#3b82f6',
                                        fontWeight: '500'
                                    }}>
                                        {project.contractor} - {project.name}
                                    </Link>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                        {project.city}/{project.state}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>
                                        {formatCurrency(project.totalContractsValue)}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                        Margem: {formatCurrency(project.profitMargin)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ✅ ATIVIDADES RECENTES SIMPLES */}
                {recentActivity.length > 0 && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid #e2e8f0'
                    }}>
                        <h3>⚡ Atividades Recentes</h3>
                        {recentActivity.slice(0, 5).map((activity, index) => (
                            <div key={index} style={{
                                padding: '12px 0',
                                borderBottom: index < 4 ? '1px solid #f1f5f9' : 'none'
                            }}>
                                <div style={{ fontWeight: '500' }}>{activity.description}</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                    {activity.projectContractor} - {activity.projectName}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                    {new Date(activity.activityDate).toLocaleDateString('pt-BR')} - {formatCurrency(activity.amount)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;