import React, { useState, useEffect } from 'react';
import { expenseFormMap } from '../config/expenseFormMap';

const DynamicExpenseForm = ({ costCenterId, onSubmit, onCancel, initialData = {}, submitting = false }) => {   
    const [commonData, setCommonData] = useState({
        description: initialData.description || '',
        amount: initialData.amount || '',
        date: initialData.date || new Date().toISOString().split('T')[0],
        observations: initialData.observations || '',       
        attachment: null
    });

    const [detailsData, setDetailsData] = useState(initialData.detailsJson ? JSON.parse(initialData.detailsJson) : {});      
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
        if (type === 'file') {
            setCommonData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setCommonData(prev => ({ ...prev, [name]: value }));
        }
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
    
    const inputStyle = { 
        width: '100%', 
        padding: '12px', 
        marginBottom: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxSizing: 'border-box'
    };
    const labelStyle = { 
        display: 'block', 
        marginBottom: '6px', 
        fontWeight: 'bold',
        color: '#333'
    };

    return (
        <form onSubmit={handleSubmit}>
            <fieldset style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                <legend style={{ fontWeight: 'bold', color: '#333' }}>2. Informações Gerais</legend>
                
                <label style={labelStyle}>Descrição *</label>
                <input 
                    name="description" 
                    type="text" 
                    value={commonData.description} 
                    onChange={handleCommonChange} 
                    required 
                    style={inputStyle}
                    placeholder="Descreva a despesa..."
                />
                
                <label style={labelStyle}>Data da Despesa *</label>
                <input 
                    name="date" 
                    type="date" 
                    value={commonData.date} 
                    onChange={handleCommonChange} 
                    required 
                    style={inputStyle} 
                />
                
                <label style={labelStyle}>Valor (R$) *</label>
                <input 
                    name="amount" 
                    type="number" 
                    step="0.01" 
                    value={commonData.amount} 
                    onChange={handleCommonChange} 
                    placeholder="0.00" 
                    required 
                    style={inputStyle} 
                />
            </fieldset>

            {specificFields.length > 0 && (
                <fieldset style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                    <legend style={{ fontWeight: 'bold', color: '#333' }}>3. Detalhes Específicos</legend>
                    {specificFields.map(field => (
                        <div key={field.name}>
                            <label style={labelStyle}>{field.label}</label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={detailsData[field.name] || ''}
                                onChange={handleDetailsChange}
                                placeholder={field.placeholder}
                                style={inputStyle}
                            />
                        </div>
                    ))}
                </fieldset>
            )}

            <fieldset style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                <legend style={{ fontWeight: 'bold', color: '#333' }}>4. Informações Adicionais</legend>
                
                <label style={labelStyle}>Observações</label>
                <textarea 
                    name="observations" 
                    value={commonData.observations} 
                    onChange={handleCommonChange} 
                    style={{...inputStyle, height: '80px'}} 
                    placeholder="Observações adicionais..."
                />               
                
                <label style={labelStyle}>Anexo (Nota Fiscal, Comprovante)</label>
                <input 
                    name="attachment" 
                    type="file" 
                    onChange={handleCommonChange} 
                    style={inputStyle}
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
                />
                {commonData.attachment && (
                    <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '4px' }}>
                        Arquivo selecionado: {commonData.attachment.name}
                    </div>
                )}
            </fieldset>
            
            <div style={{ marginTop: '24px', textAlign: 'right' }}>
                <button 
                    type="button" 
                    onClick={onCancel}
                    disabled={submitting}
                    style={{
                        padding: '10px 20px',
                        marginRight: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        background: '#f5f5f5',
                        cursor: submitting ? 'not-allowed' : 'pointer'
                    }}
                >
                    Cancelar
                </button>
                <button 
                    type="submit"
                    disabled={submitting}
                    style={{
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '4px',
                        background: submitting ? '#ccc' : '#007bff',
                        color: 'white',
                        cursor: submitting ? 'not-allowed' : 'pointer'
                    }}
                >
                    {submitting ? 'Salvando...' : 'Salvar Despesa'}
                </button>
            </div>
        </form>
    );
};

export default DynamicExpenseForm;