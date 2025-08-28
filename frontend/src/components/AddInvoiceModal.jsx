import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import FormGroup from './common/FormGroup';
import StyledInput from './common/StyledInput';

const AddInvoiceModal = ({ contractId, onClose, onInvoiceAdded }) => {
    const [formData, setFormData] = useState({
        issueDate: '',
        invoiceNumber: '',
        grossValue: '',
        issValue: '',
        inssValue: '',
        paymentDate: ''
    });
    const [attachment, setAttachment] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setAttachment(e.target.files[0]);
    };

    const calculateNetValue = () => {
        const gross = parseFloat(formData.grossValue) || 0;
        const iss = parseFloat(formData.issValue) || 0;
        const inss = parseFloat(formData.inssValue) || 0;
        return gross - iss - inss;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.issueDate || !formData.invoiceNumber || !formData.grossValue || !formData.paymentDate) {
            toast.error('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const netValue = calculateNetValue();
        if (netValue < 0) {
            toast.error('O valor líquido não pode ser negativo.');
            return;
        }

        setSubmitting(true);

        const data = new FormData();
        data.append('issueDate', formData.issueDate);
        data.append('invoiceNumber', formData.invoiceNumber);
        data.append('grossValue', formData.grossValue);
        data.append('issValue', formData.issValue || 0);
        data.append('inssValue', formData.inssValue || 0);
        data.append('paymentDate', formData.paymentDate);
        data.append('contractId', contractId);
        data.append('Status', 1); // 1 = Valid
        if (attachment) {
            data.append('attachment', attachment);
        }

        const promise = axios.post('http://localhost:5145/api/contractinvoices', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        toast.promise(promise, {
            loading: 'Salvando nota fiscal...',
            success: (res) => {
                onInvoiceAdded(res.data);
                onClose();
                return 'Nota fiscal adicionada com sucesso!';
            },
            error: (err) => err.response?.data?.message || 'Falha ao adicionar a nota fiscal.'
        }).finally(() => setSubmitting(false));
    };
    
    const netValueDisplay = calculateNetValue().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2 className="modal-title">📋 Nova Nota Fiscal</h2>
                    <button onClick={onClose} className="modal-close-button">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-section">
                        <h3 className="section-divider" style={{marginTop: 0}}>ℹ️ Dados da Nota Fiscal</h3>
                        <div className="form-grid">
                            <FormGroup label="Data Emissão *">
                                <StyledInput type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} required />
                            </FormGroup>
                            <FormGroup label="Número da NF *">
                                <StyledInput type="text" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} required placeholder="Ex: 123456" />
                            </FormGroup>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="section-divider">💰 Valores Financeiros</h3>
                        <div className="form-grid">
                            <FormGroup label="Valor Bruto *">
                                <StyledInput type="number" step="0.01" name="grossValue" value={formData.grossValue} onChange={handleChange} required placeholder="0.00" />
                            </FormGroup>
                            <FormGroup label="Valor ISS">
                                <StyledInput type="number" step="0.01" name="issValue" value={formData.issValue} onChange={handleChange} placeholder="0.00" />
                            </FormGroup>
                            <FormGroup label="Valor INSS">
                                <StyledInput type="number" step="0.01" name="inssValue" value={formData.inssValue} onChange={handleChange} placeholder="0.00" />
                            </FormGroup>
                            <FormGroup label="Valor Líquido">
                                <div className="form-input read-only">{netValueDisplay}</div>
                            </FormGroup>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="section-divider">📅 Pagamento e Anexo</h3>
                        <div className="form-grid">
                            <FormGroup label="Data Pagamento *">
                                <StyledInput type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange} required />
                            </FormGroup>
                            <FormGroup label="Anexar Arquivo">
                                <StyledInput type="file" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
                            </FormGroup>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="form-button-secondary">
                            Cancelar
                        </button>
                        <button type="submit" disabled={submitting} className="form-button">
                            {submitting ? 'Salvando...' : 'Salvar Nota Fiscal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddInvoiceModal;