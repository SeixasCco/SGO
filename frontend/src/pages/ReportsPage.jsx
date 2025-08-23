// ✅ ARQUIVO COMPLETO: /frontend/src/pages/ReportsPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ExpenseCharts from './ExpenseCharts';

const ReportsPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [projects, setProjects] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [summary, setSummary] = useState({});

    // Estados dos filtros
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        projectIds: [],
        reportType: 'detailed'
    });

    // Buscar projetos para filtro
    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:5145/api/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Erro ao buscar projetos:', error);
        }
    };

    const fetchReportData = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            filters.projectIds.forEach(id => params.append('projectIds', id));

            const response = await axios.get(`http://localhost:5145/api/reports/expenses?${params}`);
           
            const expensesList = response.data.detailedExpenses || [];
            setReportData(expensesList);
            
            const total = expensesList.reduce((sum, item) => sum + item.amount, 0);
            const byProject = expensesList.reduce((acc, item) => {
                const key = item.projectName;
                acc[key] = (acc[key] || 0) + item.amount;
                return acc;
            }, {});

            setSummary({
                totalExpenses: total,
                totalRecords: expensesList.length,
                byProject,
                averageExpense: expensesList.length > 0 ? total / expensesList.length : 0
            });

        } catch (error) {
            setError('Erro ao carregar relatório de despesas');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleProjectFilter = (projectId) => {
        setFilters(prev => ({
            ...prev,
            projectIds: prev.projectIds.includes(projectId)
                ? prev.projectIds.filter(id => id !== projectId)
                : [...prev.projectIds, projectId]
        }));
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const exportToExcel = async () => {
        try {
            const params = new URLSearchParams();
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            filters.projectIds.forEach(id => params.append('projectIds', id));

            const response = await axios.get(`http://localhost:5145/api/reports/expenses/excel?${params}`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `relatorio-despesas-${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            alert('Erro ao exportar relatório');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f1f5f9',
            padding: '0'
        }}>
            {/* Header Moderno */}
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
                            fontSize: '2.5rem',
                            fontWeight: '800',
                            color: '#0f172a',
                            margin: '0 0 8px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px'
                        }}>
                            📊 Relatórios Gerenciais
                        </h1>
                        <p style={{
                            fontSize: '1.1rem',
                            color: '#64748b',
                            margin: 0
                        }}>
                            Análise completa de despesas por obra • Atualizado em tempo real
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={exportToExcel}
                            disabled={reportData.length === 0}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#059669',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: reportData.length === 0 ? 'not-allowed' : 'pointer',
                                opacity: reportData.length === 0 ? 0.5 : 1,
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            📑 Exportar Excel
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#6b7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            ← Voltar
                        </button>
                    </div>
                </div>
            </div>

            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '0 48px'
            }}>
                {/* Seção de Filtros Moderna */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '32px',
                    marginBottom: '32px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #e2e8f0'
                }}>
                    <h3 style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#1e293b',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        🔍 Filtros de Pesquisa
                    </h3>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '20px',
                        marginBottom: '24px'
                    }}>
                        {/* Filtro de Data Início */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '8px'
                            }}>
                                📅 Data Inicial
                            </label>
                            <input
                                type="date"
                                value={filters.startDate}
                                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e2e8f0',
                                    backgroundColor: '#dcdedfff',
                                    color: '#1f2937',
                                    borderRadius: '10px',
                                    fontSize: '1rem',
                                    transition: 'border-color 0.2s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        {/* Filtro de Data Fim */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '8px'
                            }}>
                                📅 Data Final
                            </label>
                            <input
                                type="date"
                                value={filters.endDate}
                                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e2e8f0',
                                    backgroundColor: '#dcdedfff',
                                    color: '#1f2937',
                                    borderRadius: '10px',
                                    fontSize: '1rem',
                                    transition: 'border-color 0.2s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        {/* Filtro de Tipo de Relatório */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '8px'
                            }}>
                                📋 Tipo de Relatório
                            </label>
                            <select
                                value={filters.reportType}
                                onChange={(e) => setFilters(prev => ({ ...prev, reportType: e.target.value }))}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '10px',
                                    backgroundColor: '#dcdedfff',
                                    color: '#1f2937',
                                    fontSize: '1rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="detailed">Detalhado por Despesa</option>
                                <option value="summary">Resumo por Obra</option>
                                <option value="by-project">Agrupado por Projeto</option>
                            </select>
                        </div>
                    </div>

                    {/* Filtros de Obras */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '12px'
                        }}>
                            🏗️ Filtrar por Obras
                        </label>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '10px'
                        }}>
                            {projects.map((project) => (
                                <button
                                    key={project.id}
                                    onClick={() => handleProjectFilter(project.id)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '20px',
                                        border: '2px solid',
                                        borderColor: filters.projectIds.includes(project.id) ? '#3b82f6' : '#e2e8f0',
                                        backgroundColor: filters.projectIds.includes(project.id) ? '#eff6ff' : 'white',
                                        color: filters.projectIds.includes(project.id) ? '#3b82f6' : '#64748b',
                                        fontSize: '0.9rem',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {project.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Botão de Buscar */}
                    <button
                        onClick={fetchReportData}
                        disabled={loading}
                        style={{
                            padding: '14px 32px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) e.target.style.backgroundColor = '#2563eb';
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) e.target.style.backgroundColor = '#3b82f6';
                        }}
                    >
                        {loading ? '⏳ Carregando...' : '🔍 Gerar Relatório'}
                    </button>
                </div>

                {/* Cards de Resumo */}
                {Object.keys(summary).length > 0 && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '20px',
                        marginBottom: '32px'
                    }}>
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            border: '1px solid #e2e8f0',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>💰</div>
                            <div style={{
                                fontSize: '2rem',
                                fontWeight: '800',
                                color: '#059669',
                                marginBottom: '8px'
                            }}>
                                {formatCurrency(summary.totalExpenses)}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>
                                Total de Despesas
                            </div>
                        </div>

                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            border: '1px solid #e2e8f0',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📊</div>
                            <div style={{
                                fontSize: '2rem',
                                fontWeight: '800',
                                color: '#3b82f6',
                                marginBottom: '8px'
                            }}>
                                {summary.totalRecords}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>
                                Lançamentos
                            </div>
                        </div>

                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            border: '1px solid #e2e8f0',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📈</div>
                            <div style={{
                                fontSize: '2rem',
                                fontWeight: '800',
                                color: '#8b5cf6',
                                marginBottom: '8px'
                            }}>
                                {formatCurrency(summary.averageExpense)}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>
                                Média por Lançamento
                            </div>
                        </div>

                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            border: '1px solid #e2e8f0',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🏗️</div>
                            <div style={{
                                fontSize: '2rem',
                                fontWeight: '800',
                                color: '#f59e0b',
                                marginBottom: '8px'
                            }}>
                                {Object.keys(summary.byProject || {}).length}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>
                                Obras com Despesas
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabela de Dados */}
                {reportData.length > 0 && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                        border: '1px solid #e2e8f0',
                        marginBottom: '32px'
                    }}>
                        <div style={{
                            backgroundColor: '#f8fafc',
                            padding: '20px 24px',
                            borderBottom: '1px solid #e2e8f0'
                        }}>
                            <h3 style={{
                                fontSize: '1.3rem',
                                fontWeight: '700',
                                color: '#1e293b',
                                margin: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                📋 Detalhamento de Despesas
                            </h3>
                        </div>

                        {/* Header da Tabela */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '120px 200px 150px 1fr 130px 80px',
                            gap: '16px',
                            padding: '16px 24px',
                            backgroundColor: '#f1f5f9',
                            borderBottom: '1px solid #e2e8f0',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            color: '#475569',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            <div>DATA</div>
                            <div>OBRA</div>
                            <div>CENTRO DE CUSTO</div>
                            <div>DESCRIÇÃO</div>
                            <div>VALOR</div>
                            <div>ANEXO</div>
                        </div>

                        {/* Linhas da Tabela */}
                        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            {reportData.map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '120px 200px 150px 1fr 130px 80px',
                                        gap: '16px',
                                        padding: '16px 24px',
                                        borderBottom: index < reportData.length - 1 ? '1px solid #f1f5f9' : 'none',
                                        transition: 'background-color 0.2s ease',
                                        fontSize: '0.95rem',
                                        alignItems: 'center'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#fafbfc'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                                >
                                    <div style={{ color: '#64748b', fontWeight: '500' }}>
                                        {formatDate(item.date)}
                                    </div>
                                    <div style={{ color: '#1e293b', fontWeight: '600' }}>
                                        {item.projectName}
                                    </div>
                                    <div style={{ color: '#64748b' }}>
                                        {item.costCenterName}
                                    </div>
                                    <div style={{ color: '#374151' }}>
                                        {item.description}
                                    </div>
                                    <div style={{
                                        color: '#059669',
                                        fontWeight: '700',
                                        textAlign: 'right'
                                    }}>
                                        {formatCurrency(item.amount)}
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        {item.attachmentPath ? (
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '4px 8px',
                                                backgroundColor: '#dcfce7',
                                                color: '#166534',
                                                borderRadius: '6px',
                                                fontSize: '0.8rem',
                                                fontWeight: '500'
                                            }}>
                                                📎 Sim
                                            </span>
                                        ) : (
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '4px 8px',
                                                backgroundColor: '#fef2f2',
                                                color: '#991b1b',
                                                borderRadius: '6px',
                                                fontSize: '0.8rem',
                                                fontWeight: '500'
                                            }}>
                                                ❌ Não
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Gráficos Visuais */}
                <ExpenseCharts reportData={reportData} summary={summary} />

                {/* Estado vazio */}
                {!loading && reportData.length === 0 && Object.keys(summary).length === 0 && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '64px 32px',
                        textAlign: 'center',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                        border: '1px solid #e2e8f0'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.5 }}>📊</div>
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            color: '#64748b',
                            marginBottom: '12px'
                        }}>
                            Nenhum relatório gerado ainda
                        </h3>
                        <p style={{
                            color: '#9ca3af',
                            fontSize: '1.1rem',
                            maxWidth: '400px',
                            margin: '0 auto'
                        }}>
                            Configure os filtros acima e clique em "Gerar Relatório" para visualizar as informações de despesas.
                        </p>
                    </div>
                )}

                {/* Estado de loading */}
                {loading && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '64px 32px',
                        textAlign: 'center',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                        border: '1px solid #e2e8f0'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.5 }}>⏳</div>
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            color: '#64748b',
                            marginBottom: '12px'
                        }}>
                            Gerando relatório...
                        </h3>
                        <p style={{
                            color: '#9ca3af',
                            fontSize: '1.1rem'
                        }}>
                            Processando dados de despesas, aguarde um momento.
                        </p>
                    </div>
                )}

                {/* Estado de erro */}
                {error && (
                    <div style={{
                        backgroundColor: '#fef2f2',
                        borderRadius: '16px',
                        padding: '32px',
                        textAlign: 'center',
                        border: '1px solid #fecaca',
                        marginBottom: '32px'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>❌</div>
                        <h3 style={{
                            fontSize: '1.3rem',
                            fontWeight: '600',
                            color: '#b91c1c',
                            marginBottom: '8px'
                        }}>
                            Erro ao carregar relatório
                        </h3>
                        <p style={{ color: '#991b1b', fontSize: '1rem' }}>
                            {error}
                        </p>
                        <button
                            onClick={fetchReportData}
                            style={{
                                marginTop: '16px',
                                padding: '10px 20px',
                                backgroundColor: '#dc2626',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            Tentar Novamente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportsPage;