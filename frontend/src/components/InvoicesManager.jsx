import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddInvoiceModal from './AddInvoiceModal';
import EditInvoiceModal from './EditInvoiceModal';


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
        <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            marginTop: '48px'
        }}>
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

            <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                paddingBottom: '8px',
                borderBottom: '2px solid #f1f5f9'
            }}>
                💵 Controle Financeiro (Notas Fiscais)
            </h3>

            <div style={{ marginBottom: '24px' }}>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 24px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                    }}>
                    + Adicionar Nota Fiscal
                </button>
            </div>

            {/* Grid/Lista de Notas Fiscais */}
            {loading ? (
                <p>Carregando notas fiscais...</p>
            ) : error ? (
                <p style={{ color: '#b91c1c' }}>{error}</p>
            ) : invoices.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <span style={{ fontSize: '1.5rem' }}>🧐</span>
                    <p style={{ color: '#64748b', fontWeight: '500' }}>Nenhuma nota fiscal lançada para este contrato ainda.</p>
                </div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#475569' }}>Título</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#475569' }}>Valor Bruto</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#475569' }}>Valor Líquido</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#475569' }}>Data Depósito</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#475569' }}>Anexo</th>
                            <th style={{ padding: '12px', textAlign: 'center', color: '#475569' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map(invoice => (
                            <tr key={invoice.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '12px', fontWeight: '500' }}>{invoice.title}</td>
                                <td style={{ padding: '12px' }}>{formatCurrency(invoice.grossValue)}</td>
                                <td style={{ padding: '12px', fontWeight: '600', color: '#166534' }}>{formatCurrency(invoice.netValue)}</td>
                                <td style={{ padding: '12px' }}>{formatDate(invoice.depositDate)}</td>
                                
                                <td style={{ padding: '12px' }}>
                                    {invoice.attachmentPath ? (
                                        <a
                                            href={`http://localhost:5145/api/attachments/${invoice.attachmentPath}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: '#3b82f6', textDecoration: 'underline', fontWeight: '500' }}
                                        >
                                            Ver Anexo
                                        </a>
                                    ) : (
                                        <span style={{ color: '#9ca3af' }}>N/A</span>
                                    )}
                                </td>
                                
                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                    <button
                                        onClick={() => setEditingInvoice(invoice)}
                                        style={{ marginRight: '8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1rem' }}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(invoice.id)}
                                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1rem' }}
                                    >
                                        🗑️
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default InvoicesManager;