// frontend/src/components/AddContractModal.jsx

import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'; // Importe o toast

// Importando os componentes de formulário padronizados
import FormGroup from './common/FormGroup';
import StyledInput from './common/StyledInput';

// Componente de Textarea padronizado
const StyledTextarea = (props) => (
    <textarea className="form-textarea" {...props} />
);

// Componentes de botão padronizados
const PrimaryButton = ({ children, submitting, ...props }) => (
    <button type="submit" disabled={submitting} className="form-button" {...props}>
        {submitting ? 'Criando...' : children}
    </button>
);

const SecondaryButton = ({ children, submitting, ...props }) => (
    <button type="button" disabled={submitting} className="form-button-secondary" {...props}>
        {children}
    </button>
);

const AddContractModal = ({ isOpen, onClose, projectId, projectName, onContractAdded }) => {
    const [formData, setFormData] = useState({
        contractNumber: '',
        title: '',
        totalValue: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        observations: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    const resetForm = () => {
        setFormData({
            contractNumber: '',
            title: '',
            totalValue: '',
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            observations: ''
        });
        setError('');
    }

    const handleCancel = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const contractData = {
                projectId: projectId,
                contractNumber: formData.contractNumber.trim(),
                title: formData.title.trim(),
                totalValue: parseFloat(formData.totalValue) || 0,
                startDate: formData.startDate,
                endDate: formData.endDate || null,
                observations: formData.observations.trim() || null
            };

            await axios.post('http://localhost:5145/api/contracts', contractData);
            
            toast.success('Contrato criado com sucesso!'); // <-- MENSAGEM DE SUCESSO
            
            resetForm();
            onContractAdded(); // Atualiza a lista de contratos na página
            onClose(); // Fecha o modal
        } catch (err) {
            const errorMessage = err.response?.data?.title || 'Erro ao criar contrato. Verifique os dados.';
            setError(errorMessage);
            toast.error(errorMessage); // <-- MENSAGEM DE ERRO
            console.error('Erro ao criar contrato:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        // ESTRUTURA DO MODAL RESTAURADA COM CLASSES CSS
        <div className="modal-overlay">
            <div className="modal-container">

                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">📄 Novo Contrato</h2>
                        <p className="modal-subtitle">
                            Obra: <strong>{projectName}</strong>
                        </p>
                    </div>
                    <button onClick={handleCancel} className="modal-close-button">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    {error && <div className="form-error-message">{error}</div>}
                    
                    <div className="form-grid">
                        <div style={{ gridColumn: '1 / -1' }}>
                            <FormGroup label="Número do Contrato *">
                                <StyledInput
                                    type="text"
                                    name="contractNumber"
                                    value={formData.contractNumber}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ex: T30/2025, CONT-001/2024..."
                                />
                            </FormGroup>
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <FormGroup label="Título do Contrato *">
                                <StyledInput
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ex: Construção Supermercado..."
                                />
                            </FormGroup>
                        </div>
                        
                        <FormGroup label="Valor Total (R$) *">
                           <StyledInput
                                type="number"
                                step="0.01"
                                min="0"
                                name="totalValue"
                                value={formData.totalValue}
                                onChange={handleChange}
                                required
                                placeholder="0.00"
                            />
                        </FormGroup>

                        <FormGroup label="Data de Início *">
                            <StyledInput
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>
                        
                        <FormGroup label="Data de Fim (Opcional)">
                            <StyledInput
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                            />
                        </FormGroup>
                    </div>
                    
                    <FormGroup label="Observações (Opcional)">
                        <StyledTextarea
                            name="observations"
                            value={formData.observations}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Detalhes adicionais sobre o contrato..."
                        />
                    </FormGroup>

                    <div className="modal-footer">
                        <SecondaryButton onClick={handleCancel} submitting={submitting}>
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton submitting={submitting}>
                           💾 Criar Contrato
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddContractModal;