import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import FormGroup from '../components/common/FormGroup';
import StyledInput from '../components/common/StyledInput';

const ReportsPage = () => {
    const [reportData, setReportData] = useState([]);
    const [summary, setSummary] = useState({});
    const [companyInfo, setCompanyInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [projects, setProjects] = useState([]);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        projectIds: []
    });

    const fetchProjects = useCallback(() => {
        axios.get('http://localhost:5145/api/projects')
            .then(response => setProjects(response.data || []))
            .catch(error => console.error('Erro ao carregar projetos:', error));
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const fetchReportData = async () => {
        setLoading(true);
        setError('');
        
        try {
            const params = new URLSearchParams();
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            filters.projectIds.forEach(id => params.append('projectIds', id));

            const response = await axios.get(`http://localhost:5145/api/reports/expenses?${params}`);
            const data = response.data;
            
            setReportData(data.detailedExpenses || []);
            setSummary(data.summary || {});
            setCompanyInfo({
                name: data.companyName || '',
                cnpj: data.companyCnpj || '',
                generatedAt: data.generatedAt || '',
                filterStartDate: data.filterStartDate,
                filterEndDate: data.filterEndDate
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
    const formatDateTime = (dateString) => new Date(dateString).toLocaleString('pt-BR');

    return (
        <div className="container">
            <div className="page-header">
                <div className="page-header-content">
                    <h1 className="page-title">Relatórios de Despesas</h1>
                    <p className="page-subtitle">Análise detalhada dos gastos por obra e centro de custo</p>
                </div>
                {reportData.length > 0 && (
                    <button onClick={exportToExcel} className="export-button">
                        Exportar Excel
                    </button>
                )}
            </div>

            <div className="page-content">
                {/* Filtros */}
                <div className="filters-section">
                    <h3>Filtros de Pesquisa</h3>
                    
                    <FormGroup label="Período">
                        <div className="date-range">
                            <StyledInput 
                                type="date" 
                                value={filters.startDate} 
                                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                                placeholder="Data Inicial"
                            />
                            <StyledInput 
                                type="date" 
                                value={filters.endDate} 
                                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                                placeholder="Data Final"
                            />
                        </div>
                    </FormGroup>
                    
                    <FormGroup label="Filtrar por Obras">
                        <div className="filter-chips">
                            {projects.map(project => (
                                <button
                                    key={project.id}
                                    onClick={() => handleProjectFilter(project.id)}
                                    className={`filter-chip ${filters.projectIds.includes(project.id) ? 'active' : ''}`}
                                >
                                    {project.name}
                                </button>
                            ))}
                        </div>
                    </FormGroup>
                    
                    <button onClick={fetchReportData} disabled={loading} className="generate-button">
                        {loading ? 'Carregando...' : 'Gerar Relatório'}
                    </button>
                </div>

                {/* Cards de Resumo Simplificado */}
                {Object.keys(summary).length > 0 && (
                    <div className="simple-summary">
                        <div className="summary-item">
                            <span className="summary-label">Total de Despesas:</span>
                            <span className="summary-value">{formatCurrency(summary.totalExpenses)}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Total de Lançamentos:</span>
                            <span className="summary-value">{summary.totalRecords}</span>
                        </div>
                    </div>
                )}
                
                {/* Relatório em Formato A4 */}
                {reportData.length > 0 && (
                    <div className="a4-report">
                        {/* Cabeçalho da Empresa */}
                        <div className="report-header-a4">
                            <h2>{companyInfo.name || 'Nome da Empresa'}</h2>
                            <p>CNPJ: {companyInfo.cnpj || 'XX.XXX.XXX/XXXX-XX'}</p>
                            <div className="report-meta">
                                Gerado em: {formatDateTime(companyInfo.generatedAt)}
                            </div>
                        </div>

                        {/* Resumo Superior */}
                        <div className="summary-header">
                            <div className="summary-line">
                                <span>Total de Despesas:</span>
                                <span>{formatCurrency(summary.totalExpenses)}</span>
                            </div>
                            <div className="summary-line">
                                <span>Total de Lançamentos:</span>
                                <span>{summary.totalRecords}</span>
                            </div>
                        </div>

                        {/* Título do Período */}
                        <div className="period-title">
                            <h3>Período de Apuração: Início a Fim</h3>
                            <p>Baseado apenas nos dados informados</p>
                        </div>

                        {/* Dados das Despesas */}
                        <div className="expenses-data">
                            {reportData.map((item, index) => (
                                <div key={index} className="expense-line">
                                    <div className="expense-line-header">
                                        <span className="expense-date">{formatDate(item.date)}</span>
                                        <span className="expense-title">
                                            {item.mainDescription} - <strong>{item.costCenterName}</strong>
                                        </span>
                                        <span className="expense-amount">{formatCurrency(item.amount)}</span>
                                    </div>
                                    {item.formattedDetails && item.formattedDetails !== '' && (
                                        <div className="expense-details-line">
                                            {item.formattedDetails}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Rodapé com Resumo */}
                        <div className="report-footer-a4">
                            <h3>Resumo do Período</h3>
                            <div className="total-line">
                                <span>TOTAL GERAL:</span>
                                <span>{formatCurrency(summary.totalExpenses)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Estados de Vazio, Loading e Erro */}
                {!loading && reportData.length === 0 && Object.keys(summary).length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon">📊</div>
                        <h3>Nenhum relatório gerado</h3>
                        <p>Configure os filtros acima e clique em "Gerar Relatório" para visualizar as informações.</p>
                    </div>
                )}
                {loading && (
                    <div className="empty-state">
                        <div className="empty-state-icon">⏳</div>
                        <h3>Processando relatório...</h3>
                        <p>Aguarde enquanto os dados são processados.</p>
                    </div>
                )}
                 {error && (
                    <div className="error-state">
                        <div className="empty-state-icon">❌</div>
                        <h3>Erro ao processar relatório</h3>
                        <p>{error}</p>
                        <button onClick={fetchReportData} className="generate-button">Tentar Novamente</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportsPage;