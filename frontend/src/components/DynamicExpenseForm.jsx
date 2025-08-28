import React, { useState, useEffect } from 'react';
import { expenseFormMap } from '../config/expenseFormMap';

import FormGroup from './common/FormGroup';
import StyledInput from './common/StyledInput';

const StyledTextarea = (props) => (
    <textarea className="form-textarea" {...props} />
);

const DynamicExpenseForm = ({ costCenterId, onSubmit, onCancel, initialData = {}, submitting = false }) => {
    const [commonData, setCommonData] = useState({
        description: initialData.description || '',
        amount: initialData.amount || '',
        date: initialData.date || new Date().toISOString().split('T')[0],
        observations: initialData.observations || '',
        attachment: null
    });

    const [detailsData, setDetailsData] = useState(() => {
        const initialDetails = {};
        const fieldsForCostCenter = expenseFormMap[costCenterId] || [];
        fieldsForCostCenter.forEach(field => {
            initialDetails[field.name] = initialData.details?.[field.name] || '';
        });
        return initialDetails;
    });

    const specificFields = expenseFormMap[costCenterId] || [];

    useEffect(() => {        
        const initialDetails = {};
        const fieldsForCostCenter = expenseFormMap[costCenterId] || [];
        fieldsForCostCenter.forEach(field => {
            initialDetails[field.name] = '';
        });
        setDetailsData(initialDetails);
    }, [costCenterId]);

    const handleCommonChange = (e) => {
        const { name, value, type, files } = e.target;
        setCommonData(prev => ({ ...prev, [name]: type === 'file' ? files[0] : value }));
    };

    const handleDetailsChange = (e) => {
        const { name, value } = e.target;
        setDetailsData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const fullExpenseData = {
            ...commonData,
            amount: parseFloat(commonData.amount),
            details: detailsData,
        };
        onSubmit(fullExpenseData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-section">
                <div className="form-grid">
                    <FormGroup label="Descrição *">
                        <StyledInput
                            name="description"
                            type="text"
                            value={commonData.description}
                            onChange={handleCommonChange}
                            required
                            placeholder="Descreva a despesa..."
                        />
                    </FormGroup>
                    <FormGroup label="Data da Despesa *">
                        <StyledInput
                            name="date"
                            type="date"
                            value={commonData.date}
                            onChange={handleCommonChange}
                            required
                        />
                    </FormGroup>
                    <FormGroup label="Valor (R$) *">
                        <StyledInput
                            name="amount"
                            type="number"
                            step="0.01"
                            value={commonData.amount}
                            onChange={handleCommonChange}
                            placeholder="0.00"
                            required
                        />
                    </FormGroup>
                </div>
            </div>

            {specificFields.length > 0 && (
                <div className="form-section">
                    <h3 className="section-divider" style={{marginTop: 0, fontSize: '1rem'}}>Detalhes Específicos</h3>
                    <div className="form-grid">
                        {specificFields.map(field => (
                            <FormGroup key={field.name} label={field.label}>
                                <StyledInput
                                    type={field.type}
                                    name={field.name}
                                    value={detailsData[field.name] || ''}
                                    onChange={handleDetailsChange}
                                    placeholder={field.placeholder}
                                />
                            </FormGroup>
                        ))}
                    </div>
                </div>
            )}

            <div className="form-section">
                 <div className="form-grid">
                    <div style={{gridColumn: '1 / -1'}}>
                        <FormGroup label="Observações">
                            <StyledTextarea
                                name="observations"
                                value={commonData.observations}
                                onChange={handleCommonChange}
                                placeholder="Observações adicionais..."
                            />
                        </FormGroup>
                    </div>
                    <div style={{gridColumn: '1 / -1'}}>
                         <FormGroup label="Anexo (Nota Fiscal, Comprovante)">
                            <StyledInput
                                name="attachment"
                                type="file"
                                onChange={handleCommonChange}
                                accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
                            />
                             {commonData.attachment && (
                                <div className="form-help-text" style={{marginTop: '8px'}}>
                                    Arquivo selecionado: {commonData.attachment.name}
                                </div>
                            )}
                        </FormGroup>
                    </div>
                </div>
            </div>
            
            <div className="modal-footer" style={{ borderTop: 'none', paddingTop: 0 }}>
                <button type="button" onClick={onCancel} disabled={submitting} className="form-button-secondary">
                    Cancelar
                </button>
                <button type="submit" disabled={submitting} className="form-button">
                    {submitting ? 'Salvando...' : 'Salvar Despesa'}
                </button>
            </div>
        </form>
    );
};

export default DynamicExpenseForm;