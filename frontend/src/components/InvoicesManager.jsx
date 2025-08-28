import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import AddInvoiceModal from './AddInvoiceModal';
import EditInvoiceModal from './EditInvoiceModal';
import AttachmentPreviewModal from './AttachmentPreviewModal';
import StatusBadge from './common/StatusBadge';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

const InvoicesManager = ({ contractId }) => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState(null);
    const [previewAttachment, setPreviewAttachment] = useState(null);

    const fetchInvoices = useCallback(() => {
        if (!contractId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        axios.get(`http://localhost:5145/api/contractinvoices/by-contract/${contractId}`)
            .then(response => setInvoices(response.data || []))
            .catch(() => toast.error('Não foi possível carregar as notas fiscais.'))
            .finally(() => setLoading(false));
    }, [contractId]);

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    const handleInvoiceAdded = (newInvoice) => {
        setInvoices(prev => [newInvoice, ...prev]);
    };

    const handleInvoiceUpdated = (updatedInvoice) => {
        setInvoices(prev => prev.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
    };

    const handleDelete = (invoiceId) => {
        if (window.confirm('Tem certeza que deseja deletar esta nota fiscal?')) {
            axios.delete(`http://localhost:5145/api/contractinvoices/${invoiceId}`)
                .then(() => {
                    toast.success('Nota fiscal deletada com sucesso.');
                    setInvoices(prevInvoices => prevInvoices.filter(inv => inv.id !== invoiceId));
                })
                .catch(err => {
                    toast.error('Não foi possível deletar a nota fiscal.');
                    console.error("Erro ao deletar:", err);
                });
        }
    };

    const handleCancelInvoice = (invoiceId) => {
        toast((t) => (
            <div>
                <p style={{ margin: 0, fontWeight: '600' }}>Marcar esta nota como cancelada?</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button onClick={() => {
                        toast.dismiss(t.id);
                        const promise = axios.patch(`http://localhost:5145/api/contractinvoices/${invoiceId}/cancel`);
                        toast.promise(promise, {
                            loading: 'Cancelando...',
                            success: () => {
                                fetchInvoices();
                                return 'Nota fiscal cancelada!';
                            },
                            error: 'Falha ao cancelar.',
                        });
                    }} className="form-button danger small">
                        Sim, Cancelar
                    </button>
                    <button onClick={() => toast.dismiss(t.id)} className="form-button-secondary small">
                        Não
                    </button>
                </div>
            </div>
        ), { icon: '⚠️' });
    };

    const getFileIcon = (attachmentPath) => {
        if (!attachmentPath) return null;
        const extension = attachmentPath.split('.').pop()?.toLowerCase();
        const iconMap = { 'pdf': '📄', 'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'doc': '📝', 'docx': '📝' };
        return iconMap[extension] || '📎';
    };

    return (
        <div className="card" style={{ marginTop: '32px' }}>
            {isAddModalOpen && <AddInvoiceModal contractId={contractId} onClose={() => setIsAddModalOpen(false)} onInvoiceAdded={handleInvoiceAdded} />}
            {editingInvoice && <EditInvoiceModal invoice={editingInvoice} onClose={() => setEditingInvoice(null)} onInvoiceUpdated={handleInvoiceUpdated} />}
            {previewAttachment && <AttachmentPreviewModal attachmentPath={previewAttachment.path} invoiceNumber={previewAttachment.invoiceNumber} onClose={() => setPreviewAttachment(null)} />}

            <div className="section-header">
                <h2 className="section-title">💵 Controle Financeiro (Notas Fiscais)</h2>
                <button onClick={() => setIsAddModalOpen(true)} className="form-button">
                    + Adicionar Nota Fiscal
                </button>
            </div>

            <div className="section-body">
                {loading ? (
                    <div className="loading-state">Carregando notas fiscais...</div>
                ) : invoices.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🧐</div>
                        <p>Nenhuma nota fiscal lançada para este contrato ainda.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Data Emissão</th>
                                    <th>Num NF</th>
                                    <th>R$ Bruto</th>
                                    <th>R$ ISS</th>
                                    <th>R$ INSS</th>
                                    <th>R$ Líquido</th>
                                    <th>Data Pgto</th>
                                    <th style={{ textAlign: 'center' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map(invoice => (
                                    <tr key={invoice.id}>
                                        <td><StatusBadge status={invoice.status === 1 ? 'active' : 'cancelled'} textOverride={{ active: 'Válida', cancelled: 'Cancelada' }} /></td>
                                        <td>{formatDate(invoice.issueDate)}</td>
                                        <td><span className="badge info">#{invoice.invoiceNumber}</span></td>
                                        <td>{formatCurrency(invoice.grossValue)}</td>
                                        <td className="text-danger">{formatCurrency(invoice.issValue || 0)}</td>
                                        <td className="text-danger">{formatCurrency(invoice.inssValue || 0)}</td>
                                        <td className="text-success">{formatCurrency(invoice.netValue)}</td>
                                        <td>{formatDate(invoice.paymentDate)}</td>
                                        <td>
                                            <div className="actions-container">
                                                {invoice.attachmentPath && (
                                                    <button onClick={() => setPreviewAttachment({ path: invoice.attachmentPath, invoiceNumber: invoice.invoiceNumber })} className="action-button-icon" title="Ver anexo">
                                                        {getFileIcon(invoice.attachmentPath)}
                                                    </button>
                                                )}
                                                {invoice.status === 1 && (
                                                    <button onClick={() => handleCancelInvoice(invoice.id)} className="action-button-icon danger" title="Cancelar Nota">✖️</button>
                                                )}
                                                <button onClick={() => setEditingInvoice(invoice)} className="action-button-icon" title="Editar Nota">✏️</button>
                                                <button onClick={() => handleDelete(invoice.id)} className="action-button-icon" title="Deletar Nota">🗑️</button>

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvoicesManager;