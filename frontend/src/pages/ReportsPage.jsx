import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ExpenseCharts from './ExpenseCharts';
import FormGroup from '../components/common/FormGroup';
import StyledInput from '../components/common/StyledInput';

const ReportsPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [projects, setProjects] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [summary, setSummary] = useState({});

    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        projectIds: [],
        reportType: 'detailed'
    });

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

    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('pt-BR');

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <div className="page-header-content">
                    <div>
                        <h1 className="page-title">📊 Relatórios Gerenciais</h1>
                        <p className="page-subtitle">Análise completa de despesas por obra • Atualizado em tempo real</p>
                    </div>
                    <div className="page-header-actions">
                        <button onClick={exportToExcel} disabled={reportData.length === 0} className="form-button">
                            📑 Exportar Excel
                        </button>
                        <button onClick={() => navigate('/')} className="form-button-secondary">
                            ← Voltar
                        </button>
                    </div>
                </div>
            </div>

            <div className="page-content">
                {/* Seção de Filtros */}
                <div className="card">
                    <h3 className="card-header">🔍 Filtros de Pesquisa</h3>
                    <div className="form-grid">
                        <FormGroup label="📅 Data Inicial">
                            <StyledInput type="date" value={filters.startDate} onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))} />
                        </FormGroup>
                        <FormGroup label="📅 Data Final">
                            <StyledInput type="date" value={filters.endDate} onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))} />
                        </FormGroup>
                        <FormGroup label="📋 Tipo de Relatório">
                             <select value={filters.reportType} onChange={(e) => setFilters(prev => ({ ...prev, reportType: e.target.value }))} className="form-select">
                                <option value="detailed">Detalhado por Despesa</option>
                                <option value="summary">Resumo por Obra</option>
                                <option value="by-project">Agrupado por Projeto</option>
                            </select>
                        </FormGroup>
                    </div>

                    <FormGroup label="🏗️ Filtrar por Obras">
                        <div className="filter-button-group">
                            {projects.map((project) => (
                                <button
                                    key={project.id}
                                    onClick={() => handleProjectFilter(project.id)}
                                    className={`filter-button ${filters.projectIds.includes(project.id) ? 'active' : ''}`}
                                >
                                    {project.name}
                                </button>
                            ))}
                        </div>
                    </FormGroup>
                    
                    <button onClick={fetchReportData} disabled={loading} className="form-button">
                        {loading ? '⏳ Carregando...' : '🔍 Gerar Relatório'}
                    </button>
                </div>

                {/* Cards de Resumo */}
                {Object.keys(summary).length > 0 && (
                    <div className="summary-grid">
                        <div className="summary-card">
                            <div className="summary-card-icon">💰</div>
                            <div className="summary-card-value" style={{color: '#059669'}}>{formatCurrency(summary.totalExpenses)}</div>
                            <div className="summary-card-label">Total de Despesas</div>
                        </div>
                        <div className="summary-card">
                            <div className="summary-card-icon">📊</div>
                            <div className="summary-card-value" style={{color: '#3b82f6'}}>{summary.totalRecords}</div>
                            <div className="summary-card-label">Lançamentos</div>
                        </div>
                        <div className="summary-card">
                            <div className="summary-card-icon">📈</div>
                            <div className="summary-card-value" style={{color: '#8b5cf6'}}>{formatCurrency(summary.averageExpense)}</div>
                            <div className="summary-card-label">Média por Lançamento</div>
                        </div>
                        <div className="summary-card">
                            <div className="summary-card-icon">🏗️</div>
                            <div className="summary-card-value" style={{color: '#f59e0b'}}>{Object.keys(summary.byProject || {}).length}</div>
                            <div className="summary-card-label">Obras com Despesas</div>
                        </div>
                    </div>
                )}
                
                {/* Tabela de Dados */}
                {reportData.length > 0 && (
                    <div className="card">
                         <h3 className="card-header">📋 Detalhamento de Despesas</h3>
                         <div className="report-table">
                            <div className="report-table-header">
                                <div>DATA</div>
                                <div>OBRA</div>
                                <div>CENTRO DE CUSTO</div>
                                <div>DESCRIÇÃO</div>
                                <div style={{textAlign: 'right'}}>VALOR</div>
                                <div style={{textAlign: 'center'}}>ANEXO</div>
                            </div>
                            <div className="report-table-body">
                                {reportData.map((item, index) => (
                                    <div className="report-table-row" key={index}>
                                        <div>{formatDate(item.date)}</div>
                                        <div>{item.projectName}</div>
                                        <div>{item.costCenterName}</div>
                                        <div>{item.description}</div>
                                        <div className="currency">{formatCurrency(item.amount)}</div>
                                        <div style={{textAlign: 'center'}}>
                                            {item.attachmentPath 
                                                ? <span className="badge success">📎 Sim</span> 
                                                : <span className="badge error">❌ Não</span>
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                         </div>
                    </div>
                )}

                <ExpenseCharts reportData={reportData} summary={summary} />

                {/* Estados de Vazio, Loading e Erro */}
                {!loading && reportData.length === 0 && Object.keys(summary).length === 0 && (
                    <div className="card empty-state">
                        <div className="empty-state-icon">📊</div>
                        <h3>Nenhum relatório gerado ainda</h3>
                        <p>Configure os filtros acima e clique em "Gerar Relatório" para visualizar as informações.</p>
                    </div>
                )}
                {loading && (
                    <div className="card empty-state">
                        <div className="empty-state-icon">⏳</div>
                        <h3>Gerando relatório...</h3>
                        <p>Processando dados de despesas, aguarde um momento.</p>
                    </div>
                )}
                 {error && (
                    <div className="card error-state">
                        <div className="empty-state-icon">❌</div>
                        <h3>Erro ao carregar relatório</h3>
                        <p>{error}</p>
                        <button onClick={fetchReportData} className="form-button error">Tentar Novamente</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportsPage;