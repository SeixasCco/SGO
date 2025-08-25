import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddInvoiceModal from './AddInvoiceModal';
import EditInvoiceModal from './EditInvoiceModal';
import AttachmentPreviewModal from './AttachmentPreviewModal';

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

const InvoicesManager = ({ contractId }) => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState(null);
    const [previewAttachment, setPreviewAttachment] = useState(null);

    const handleInvoiceAdded = (newInvoice) => {
        setInvoices(prevInvoices => [newInvoice, ...prevInvoices]);
    };

    const handleInvoiceUpdated = (updatedInvoice) => {
        setInvoices(prevInvoices =>
            prevInvoices.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv)
        );
    };

    const handleDelete = (invoiceId) => {
        if (window.confirm('Tem certeza que deseja deletar esta nota fiscal?')) {
            axios.delete(`http://localhost:5145/api/contractinvoices/${invoiceId}`)
                .then(() => {
                    setInvoices(prevInvoices => prevInvoices.filter(inv => inv.id !== invoiceId));
                })
                .catch(err => {
                    alert('Não foi possível deletar a nota fiscal.');
                    console.error("Erro ao deletar:", err);
                });
        }
    };

    const getFileIcon = (attachmentPath) => {
        if (!attachmentPath) return null;
        
        const extension = attachmentPath.split('.').pop()?.toLowerCase();
        const iconMap = {
            'pdf': '📄',
            'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'gif': '🖼️',
            'doc': '📝', 'docx': '📝',
            'txt': '📝',
            'xls': '📊', 'xlsx': '📊',
            'zip': '📦', 'rar': '📦'
        };
        
        return iconMap[extension] || '📎';
    };

    const handleViewAttachment = (attachmentPath, invoiceNumber) => {
        if (!attachmentPath) return;      
        setPreviewAttachment({ path: attachmentPath, invoiceNumber });
    };

    useEffect(() => {
        if (!contractId) return;

        setLoading(true);
        axios.get(`http://localhost:5145/api/contractinvoices/by-contract/${contractId}`)
            .then(response => {
                setInvoices(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Não foi possível carregar as notas fiscais.');
                console.error("Erro ao buscar notas fiscais:", err);
                setLoading(false);
            });
    }, [contractId]);

    return (
        <div style={containerStyle}>
            {isModalOpen && (
                <AddInvoiceModal
                    contractId={contractId}
                    onClose={() => setIsModalOpen(false)}
                    onInvoiceAdded={handleInvoiceAdded}
                />
            )}

            {editingInvoice && (
                <EditInvoiceModal
                    invoice={editingInvoice}
                    onClose={() => setEditingInvoice(null)}
                    onInvoiceUpdated={handleInvoiceUpdated}
                />
            )}

            {previewAttachment && (
                <AttachmentPreviewModal
                    attachmentPath={previewAttachment.path}
                    invoiceNumber={previewAttachment.invoiceNumber}
                    onClose={() => setPreviewAttachment(null)}
                />
            )}

            <h3 style={headerStyle}>
                💵 Controle Financeiro (Notas Fiscais)
            </h3>

            <div style={buttonContainerStyle}>
                <button onClick={() => setIsModalOpen(true)} style={addButtonStyle}>
                    + Adicionar Nota Fiscal
                </button>
            </div>

            {/* Grid/Lista de Notas Fiscais  */}
            {loading ? (
                <div style={loadingStyle}>
                    <span style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⏳</span>
                    <p>Carregando notas fiscais...</p>
                </div>
            ) : error ? (
                <div style={errorContainerStyle}>
                    <p>{error}</p>
                </div>
            ) : invoices.length === 0 ? (
                <div style={emptyStateStyle}>
                    <span style={{ fontSize: '2rem', marginBottom: '12px' }}>🧐</span>
                    <p>Nenhuma nota fiscal lançada para este contrato ainda.</p>
                </div>
            ) : (
                <div style={tableContainerStyle}>
                    <table style={tableStyle}>
                        <thead>
                            <tr style={headerRowStyle}>
                                <th style={thStyle}>Data Emissão</th>
                                <th style={thStyle}>Num NF</th>
                                <th style={thStyle}>R$ Bruto</th>
                                <th style={thStyle}>R$ ISS</th>
                                <th style={thStyle}>R$ INSS</th>
                                <th style={thStyle}>R$ Líquido</th>
                                <th style={thStyle}>Data Pgto</th>
                                <th style={thStyleCenter}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map(invoice => (
                                <tr key={invoice.id} style={rowStyle}>
                                    <td style={tdStyle}>
                                        {formatDate(invoice.issueDate)}
                                    </td>
                                    
                                    <td style={tdStyle}>
                                        <span style={invoiceNumberStyle}>
                                            #{invoice.invoiceNumber}
                                        </span>
                                    </td>
                                    
                                    <td style={tdStyle}>
                                        {formatCurrency(invoice.grossValue)}
                                    </td>
                                    
                                    <td style={tdStyle}>
                                        <span style={deductionValueStyle}>
                                            {formatCurrency(invoice.issValue || 0)}
                                        </span>
                                    </td>
                                    
                                    <td style={tdStyle}>
                                        <span style={deductionValueStyle}>
                                            {formatCurrency(invoice.inssValue || 0)}
                                        </span>
                                    </td>
                                    
                                    <td style={tdStyle}>
                                        <span style={netValueStyle}>
                                            {formatCurrency(invoice.netValue)}
                                        </span>
                                    </td>
                                    
                                    <td style={tdStyle}>
                                        {formatDate(invoice.paymentDate)}
                                    </td>
                                    
                                    <td style={tdStyleCenter}>
                                        <div style={actionsContainerStyle}>
                                            {/* Ícone de anexo com tipo específico */}
                                            {invoice.attachmentPath && (
                                                <button
                                                    onClick={() => handleViewAttachment(invoice.attachmentPath, invoice.invoiceNumber)}
                                                    style={attachmentButtonStyle}
                                                    title={`Abrir anexo (${invoice.attachmentPath.split('.').pop()?.toUpperCase()})`}
                                                >
                                                    {getFileIcon(invoice.attachmentPath)}
                                                </button>
                                            )}
                                            
                                            {/* Botão de editar */}
                                            <button
                                                onClick={() => setEditingInvoice(invoice)}
                                                style={iconButtonStyle}
                                                title="Editar nota fiscal"
                                            >
                                                ✏️
                                            </button>
                                            
                                            {/* Botão de deletar */}
                                            <button
                                                onClick={() => handleDelete(invoice.id)}
                                                style={iconButtonDangerStyle}
                                                title="Deletar nota fiscal"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// Estilos
const containerStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    marginTop: '48px'
};

const headerStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingBottom: '8px',
    borderBottom: '2px solid #f1f5f9'
};

const buttonContainerStyle = {
    marginBottom: '24px'
};

const addButtonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
};

const loadingStyle = {
    textAlign: 'center',
    padding: '48px',
    color: '#64748b',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

const errorContainerStyle = {
    color: '#b91c1c',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center'
};

const emptyStateStyle = {
    textAlign: 'center',
    padding: '48px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    color: '#64748b',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

const tableContainerStyle = {
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
};

const headerRowStyle = {
    backgroundColor: '#f8fafc',
    borderBottom: '2px solid #e2e8f0'
};

const thStyle = {
    padding: '16px 12px',
    textAlign: 'left',
    color: '#475569',
    fontSize: '0.875rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap'
};

const thStyleCenter = {
    ...thStyle,
    textAlign: 'center'
};

const rowStyle = {
    borderBottom: '1px solid #f1f5f9',
    transition: 'background-color 0.2s ease'
};

const tdStyle = {
    padding: '16px 12px',
    fontSize: '0.9rem',
    color: '#374151',
    whiteSpace: 'nowrap'
};

const tdStyleCenter = {
    ...tdStyle,
    textAlign: 'center'
};

const invoiceNumberStyle = {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: '600'
};

const deductionValueStyle = {
    color: '#dc2626',
    fontWeight: '500'
};

const netValueStyle = {
    color: '#166534',
    fontWeight: '600'
};

const actionsContainerStyle = {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    alignItems: 'center'
};

const iconButtonStyle = {
    background: 'none',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    padding: '6px 8px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const iconButtonDangerStyle = {
    ...iconButtonStyle,
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2'
};

const attachmentButtonStyle = {
    ...iconButtonStyle,
    borderColor: '#bfdbfe',
    backgroundColor: '#eff6ff',
    fontSize: '16px'
};

export default InvoicesManager;