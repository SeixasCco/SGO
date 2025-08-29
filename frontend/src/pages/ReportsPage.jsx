import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useCompany } from '../context/CompanyContext';
import toast from 'react-hot-toast';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';

const ReportFilters = ({ filters, setFilters, projects, costCenters, onGenerate, loading }) => {
    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="filters-section">
            <div className="form-grid">
                <div className="form-group">
                    <label>Data Inicial</label>
                    <input type="date" className="form-input" value={filters.startDate} onChange={e => handleFilterChange('startDate', e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Data Final</label>
                    <input type="date" className="form-input" value={filters.endDate} onChange={e => handleFilterChange('endDate', e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Obra / Projeto</label>
                    <select className="form-select" value={filters.projectId} onChange={e => handleFilterChange('projectId', e.target.value)}>
                        <option value="">Todas as Obras</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label>Centro de Custo</label>
                    <select className="form-select" value={filters.costCenterId} onChange={e => handleFilterChange('costCenterId', e.target.value)}>
                        <option value="">Todos</option>
                        {costCenters.map(cc => <option key={cc.id} value={cc.id}>{cc.name}</option>)}
                    </select>
                </div>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={onGenerate} className="form-button">
                    🔍 Gerar Relatório
                </button>
            </div>
        </div>
    );
};

const ReportsPage = () => {
    const { selectedCompany } = useCompany();
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [projects, setProjects] = useState([]);
    const [costCenters, setCostCenters] = useState([]);

    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        projectId: '',
        costCenterId: ''
    });

    const reportComponentRef = useRef();

    useEffect(() => {
        const fetchDataForFilters = async () => {
            if (!selectedCompany) return;
            try {
                const [projectsRes, costCentersRes] = await Promise.all([
                    axios.get('http://localhost:5145/api/projects', { params: { companyId: selectedCompany.id } }),
                    axios.get('http://localhost:5145/api/costcenters')
                ]);
                setProjects(projectsRes.data);
                setCostCenters(costCentersRes.data);
            } catch (err) {
                toast.error("Falha ao carregar dados para os filtros.");
            }
        };
        fetchDataForFilters();
    }, [selectedCompany]);

    const handleGenerateReport = async () => {
        if (!selectedCompany) {
            toast.error("Por favor, selecione uma empresa.");
            return;
        }

        setLoading(true);
        setError(null);
        setReportData(null);

        try {
            const params = {
                companyId: selectedCompany.id,
                startDate: filters.startDate || null,
                endDate: filters.endDate || null,
                projectId: filters.projectId || null,
                costCenterId: filters.costCenterId || null,
            };

            const response = await axios.get('http://localhost:5145/api/reports/expenses', { params });
            setReportData(response.data);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erro ao carregar relatório.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = useReactToPrint({
        content: () => reportComponentRef.current,
        documentTitle: `Relatorio_Despesas_${selectedCompany?.name.replace(/\s/g, '_')}`
    });

    const handleExportExcel = () => {
        if (!reportData) return;

        const dataToExport = reportData.detailedExpenses.map(item => ({
            'Data': formatDate(item.date),
            'Descrição Principal': item.mainDescription,
            'Centro de Custo': item.costCenterName,
            'Obra/Projeto': item.projectName,
            'Detalhes': item.formattedDetails,
            'Valor': item.amount
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Despesas");

        const summaryData = [
            ['Total de Despesas', reportData.summary.totalExpenses],
            [],
            ['Resumo por Centro de Custo']
        ];
        Object.entries(reportData.summary.byCostCenter).forEach(([name, value]) => {
            summaryData.push([name, value]);
        });
        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summarySheet, "Resumo");

        XLSX.writeFile(workbook, `Relatorio_Despesas_${selectedCompany?.name.replace(/\s/g, '_')}.xlsx`);
    };

    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Relatórios de Despesas</h1>
                {reportData && (
                    <div className='page-header-actions'>
                        <button onClick={handleExportExcel} className="form-button-secondary">Exportar Excel</button>
                        <button onClick={handlePrint} className="form-button">Imprimir</button>
                    </div>
                )}
            </div>

            <div className="page-content">
                <div className="card">
                    <ReportFilters
                        filters={filters}
                        setFilters={setFilters}
                        projects={projects}
                        costCenters={costCenters}
                        onGenerate={handleGenerateReport}
                    />
                </div>

                {loading && <div className="loading-state" style={{ marginTop: '32px' }}>Gerando relatório...</div>}
                {error && <div className="error-state" style={{ marginTop: '32px' }}><h3>{error}</h3></div>}

                {!loading && !error && !reportData && (
                    <div className="empty-state" style={{ marginTop: '32px' }}>
                        <div className="empty-state-icon">📊</div>
                        <h3>Selecione os filtros para começar</h3>
                        <p>Escolha o período e outros filtros para gerar seu relatório de despesas.</p>
                    </div>
                )}

                {reportData && (
                    <div ref={reportComponentRef} className="card" style={{ marginTop: '32px', padding: '24px' }}>
                        {/* 1. Cabeçalho do Relatório */}
                        <div className="report-header" style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px' }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{reportData.companyName}</h2>
                            <p style={{ margin: 0, color: '#64748b' }}>CNPJ: {reportData.companyCnpj}</p>
                            <p style={{ margin: '4px 0', color: '#64748b' }}>
                                Período de Apuração:
                                <strong>
                                    {reportData.filterStartDate ? formatDate(reportData.filterStartDate) : ' Início'}
                                </strong> a <strong>
                                    {reportData.filterEndDate ? formatDate(reportData.filterEndDate) : ' Fim'}
                                </strong>
                            </p>
                            <small style={{ color: '#9ca3af' }}>Relatório gerado em: {new Date(reportData.generatedAt).toLocaleString('pt-BR')}</small>
                        </div>

                        {/* 2. Corpo do Relatório (Linhas) */}
                        <div className="report-body">
                            {reportData.detailedExpenses.length > 0 ? reportData.detailedExpenses.map((item, index) => (
                                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', padding: '12px 4px', gap: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ fontSize: '0.9rem', width: '90px', textAlign: 'center' }}>
                                            <strong>{formatDate(item.date)}</strong>
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600, margin: 0 }}>{item.mainDescription}</p>
                                            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 4px 0' }}>
                                                {item.costCenterName} • {item.projectName}
                                            </p>
                                            {item.formattedDetails && <small style={{ color: '#9ca3af', fontStyle: 'italic' }}>{item.formattedDetails}</small>}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 700, textAlign: 'right', color: '#dc2626', fontSize: '1rem', minWidth: '150px' }}>
                                        {formatCurrency(item.amount)}
                                    </div>
                                </div>
                            )) : <p>Nenhuma despesa encontrada para os filtros selecionados.</p>}
                        </div>

                        {/* 3. Rodapé com Totais */}
                        <div className="report-footer" style={{ marginTop: '32px', paddingTop: '24px', borderTop: '2px solid #e2e8f0' }}>
                            <h3 style={{ marginBottom: '16px' }}>Resumo do Período</h3>
                            <div style={{ maxWidth: '400px', marginLeft: 'auto' }}>
                                {reportData.summary.byCostCenter && Object.entries(reportData.summary.byCostCenter).map(([name, value]) => (
                                    <div key={name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#475569', padding: '4px 0' }}>
                                        <span>{name}:</span>
                                        <span style={{ fontWeight: 500 }}>{formatCurrency(value)}</span>
                                    </div>
                                ))}

                                <div style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', marginTop: '16px', paddingTop: '16px' }}>
                                    <span>TOTAL GERAL:</span>
                                    <span>{formatCurrency(reportData.summary.totalExpenses)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportsPage;