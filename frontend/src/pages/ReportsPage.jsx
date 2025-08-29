import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useCompany } from '../context/CompanyContext';
import toast from 'react-hot-toast';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportsPage = () => {
    const { companies } = useCompany();
    const [projects, setProjects] = useState([]);
    const [costCenters, setCostCenters] = useState([]);
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        reportType: 'matriz',
        companyId: '',
        projectId: '',
        costCenterId: '',
        startDate: '',
        endDate: '',
    });

    const reportComponentRef = useRef();

    useEffect(() => {
        const fetchDataForFilters = async () => {
            try {
                const [projectsRes, costCentersRes] = await Promise.all([
                    axios.get('http://localhost:5145/api/projects'),
                    axios.get('http://localhost:5145/api/costcenters')
                ]);
                setProjects(projectsRes.data || []);
                setCostCenters(costCentersRes.data || []);
            } catch (err) {
                toast.error("Falha ao carregar dados para os filtros.");
            }
        };
        fetchDataForFilters();
    }, []);

    const handleFilterChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        if (field === 'reportType') {
            newFilters.companyId = '';
            newFilters.projectId = '';
        }
        if (field === 'companyId') {
            newFilters.projectId = '';
        }
        setFilters(newFilters);
    };

    const handleGenerateReport = async () => {
        setLoading(true);
        setError(null);
        setReportData(null);
        try {
            const params = { ...filters };
            for (const key in params) {
                if (!params[key]) delete params[key];
            }
            const response = await axios.get('http://localhost:5145/api/reports/expenses', { params });
            setReportData(response.data);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erro ao carregar relatório. Verifique os filtros.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = filters.companyId 
        ? projects.filter(p => p.companyId === filters.companyId) 
        : [];

    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/A';

    const handlePrint = useReactToPrint({
        content: () => reportComponentRef.current,
        documentTitle: `Relatorio_Despesas_${Date.now()}`
    });
    
    const handleExportExcel = () => {
        if (!reportData) return;
        const dataToExport = reportData.detailedExpenses.map(item => ({
            'Data': formatDate(item.date),
            'Descrição': item.mainDescription,
            'Centro de Custo': item.costCenterName,
            'Obra/Projeto': item.projectName,
            'Detalhes Adicionais': item.formattedDetails,
            'Valor': item.amount
        }));
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Despesas");
    
        const summaryData = [['Resumo por Centro de Custo', 'Total']];
        if (reportData.summary.byCostCenter) {
            Object.entries(reportData.summary.byCostCenter).forEach(([name, value]) => {
                summaryData.push([name, value]);
            });
        }
        summaryData.push(['', '']);
        summaryData.push(['TOTAL GERAL', reportData.summary.totalExpenses]);
        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summarySheet, "Resumo");
    
        XLSX.writeFile(workbook, `Relatorio_Despesas_${Date.now()}.xlsx`);
    };

    const handleExportPdf = () => {
        if (!reportData) return;
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text(reportData.companyName, 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`CNPJ: ${reportData.companyCnpj}`, 14, 30);
        const periodo = `Período: ${formatDate(reportData.filterStartDate)} a ${formatDate(reportData.filterEndDate)}`;
        doc.text(periodo, 14, 36);

        const tableColumn = ["Data", "Descrição", "Centro de Custo", "Valor"];
        const tableRows = [];

        reportData.detailedExpenses.forEach(item => {
            const itemData = [
                formatDate(item.date),
                `${item.mainDescription}\n${item.formattedDetails || ''}`,
                item.costCenterName,
                formatCurrency(item.amount)
            ];
            tableRows.push(itemData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 50,
            styles: { valign: 'middle' },
            headStyles: { fillColor: [22, 160, 133] },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 'auto' },
                2: { cellWidth: 40 },
                3: { cellWidth: 30, halign: 'right' }
            },
            didDrawPage: (data) => {               
                doc.setFontSize(10);
                doc.text('Página ' + doc.internal.getNumberOfPages(), data.settings.margin.left, doc.internal.pageSize.height - 10);
            }
        });
        
        const finalY = doc.lastAutoTable.finalY;
        doc.setFontSize(12);
        doc.text('Resumo do Período', 14, finalY + 15);

        let summaryY = finalY + 22;
        if (reportData.summary.byCostCenter) {
            const summaryRows = Object.entries(reportData.summary.byCostCenter).map(([name, value]) => [name, formatCurrency(value)]);
            summaryRows.push(['', '']); 
            summaryRows.push([{ content: 'TOTAL GERAL:', styles: { fontStyle: 'bold' } }, { content: formatCurrency(reportData.summary.totalExpenses), styles: { fontStyle: 'bold' } }]);
            
            autoTable(doc, {
                body: summaryRows,
                startY: finalY + 20,
                theme: 'plain',
                columnStyles: {
                    0: { halign: 'left' },
                    1: { halign: 'right' }
                }
            });
        }
        
        doc.save(`Relatorio_Despesas_${Date.now()}.pdf`);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Relatórios de Despesas</h1>
                {reportData && (
                    <div className='page-header-actions'>
                        <button onClick={handleExportExcel} className="form-button-secondary">📄 Exportar Excel</button>
                        <button onClick={handleExportPdf} className="form-button-secondary">📄 Exportar PDF</button>
                        <button onClick={handlePrint} className="form-button">🖨️ Imprimir</button>
                    </div>
                )}
            </div>

            <div className="page-content">
                <div className="card">
                    <h3 className="card-header">📊 Filtros do Relatório</h3>
                    <div className="filters-section">
                        <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', alignItems: 'flex-end' }}>
                            <div className="form-group">
                                <label className="form-label">Tipo de Relatório</label>
                                <select className="form-select" value={filters.reportType} onChange={e => handleFilterChange('reportType', e.target.value)}>
                                    <option value="matriz">Despesas da Matriz</option>
                                    <option value="obra">Despesa de Obra Específica</option>
                                    <option value="consolidado">Consolidado (Matriz + Obras)</option>
                                    <option value="geral">Visão Geral (Todas as Empresas)</option>
                                </select>
                            </div>
                            {['matriz', 'obra', 'consolidado'].includes(filters.reportType) && (
                                <div className="form-group">
                                    <label className="form-label">Selecione a Empresa</label>
                                    <select className="form-select" value={filters.companyId} onChange={e => handleFilterChange('companyId', e.target.value)}>
                                        <option value="">Selecione...</option>
                                        {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            )}
                            {filters.reportType === 'obra' && (
                                <div className="form-group">
                                    <label className="form-label">Selecione a Obra</label>
                                    <select className="form-select" value={filters.projectId} onChange={e => handleFilterChange('projectId', e.target.value)} disabled={!filters.companyId}>
                                        <option value="">Selecione uma empresa primeiro...</option>
                                        {filteredProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                        <hr style={{margin: '24px 0'}} />
                        <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', alignItems: 'flex-end' }}>
                             <div className="form-group">
                                <label className="form-label">Data Inicial</label>
                                <input type="date" className="form-input" value={filters.startDate} onChange={e => handleFilterChange('startDate', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Data Final</label>
                                <input type="date" className="form-input" value={filters.endDate} onChange={e => handleFilterChange('endDate', e.target.value)} />
                            </div>
                             <div className="form-group">
                                <label className="form-label">Centro de Custo</label>
                                <select className="form-select" value={filters.costCenterId} onChange={e => handleFilterChange('costCenterId', e.target.value)}>
                                    <option value="">Todos</option>
                                    {costCenters.map(cc => <option key={cc.id} value={cc.id}>{cc.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={handleGenerateReport} className="form-button" disabled={loading}>
                                {loading ? '⏳ Gerando...' : '🔍 Gerar Relatório'}
                            </button>
                        </div>
                    </div>
                </div>

                {loading && <div className="loading-state card" style={{ marginTop: '32px' }}>Gerando relatório...</div>}
                {error && <div className="error-state card" style={{ marginTop: '32px' }}><h3>{error}</h3></div>}

                {reportData && (
                    <div ref={reportComponentRef} className="card" style={{marginTop: '32px', padding: '24px'}}>
                        <div className="report-header" style={{borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px'}}>
                            <h2 style={{margin: 0, fontSize: '1.5rem'}}>{reportData.companyName}</h2>
                            <p style={{margin: 0, color: '#64748b'}}>CNPJ: {reportData.companyCnpj}</p>
                            <p style={{margin: '4px 0', color: '#64748b'}}>
                                Período de Apuração: <strong>{formatDate(reportData.filterStartDate)}</strong> a <strong>{formatDate(reportData.filterEndDate)}</strong>
                            </p>
                            <small style={{color: '#9ca3af'}}>Relatório gerado em: {new Date(reportData.generatedAt).toLocaleString('pt-BR')}</small>
                        </div>
                        <div className="report-body">
                            {reportData.detailedExpenses.length > 0 ? reportData.detailedExpenses.map((item, index) => (
                                <div key={index} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', padding: '12px 4px', gap: '16px'}}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '16px', flex: 1}}>
                                        <div style={{fontSize: '0.9rem', width: '90px', textAlign: 'center'}}>
                                            <strong>{formatDate(item.date)}</strong>
                                        </div>
                                        <div>
                                            <p style={{fontWeight: 600, margin: 0}}>{item.mainDescription}</p>
                                            <p style={{fontSize: '0.8rem', color: '#64748b', margin: '2px 0 4px 0'}}>
                                                {item.costCenterName} • {item.projectName}
                                            </p>
                                            {item.formattedDetails && <small style={{color: '#64748b', fontStyle: 'italic'}}>{item.formattedDetails}</small>}
                                        </div>
                                    </div>
                                    <div style={{fontWeight: 700, textAlign: 'right', color: '#dc2626', fontSize: '1rem', minWidth: '150px'}}>
                                        {formatCurrency(item.amount)}
                                    </div>
                                </div>
                            )) : <div className="empty-state"><p>Nenhuma despesa encontrada para os filtros selecionados.</p></div>}
                        </div>
                        <div className="report-footer" style={{marginTop: '32px', paddingTop: '24px', borderTop: '2px solid #e2e8f0'}}>
                            <h3 style={{marginBottom: '16px'}}>Resumo do Período</h3>
                            <div style={{maxWidth: '450px', marginLeft: 'auto'}}>
                                {reportData.summary.byCostCenter && Object.entries(reportData.summary.byCostCenter).map(([name, value]) => (
                                    <div key={name} style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#475569', padding: '4px 0', borderBottom: '1px dotted #e2e8f0'}}>
                                        <span>{name}:</span>
                                        <span style={{fontWeight: 500}}>{formatCurrency(value)}</span>
                                    </div>
                                ))}
                                <div style={{fontSize: '1.2rem', fontWeight: 700, display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px'}}>
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