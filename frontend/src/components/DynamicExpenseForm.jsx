import React, { useState, useEffect } from 'react';
import { expenseFormMap } from '../config/expenseFormMap';

const DynamicExpenseForm = ({ costCenterId, onSubmit, onCancel, initialData = {} }) => {   
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
    
    const inputStyle = { width: '100%', padding: '8px', marginBottom: '10px' };
    const labelStyle = { display: 'block', marginBottom: '4px', fontWeight: 'bold' };

    return (
        <form onSubmit={handleSubmit}>
            {/* Campos Comuns */}
            <fieldset style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
                <legend>Informações Gerais</legend>
                <label style={labelStyle}>Data da Despesa*</label>
                <input name="date" type="date" value={commonData.date} onChange={handleCommonChange} required style={inputStyle} />
                
                <label style={labelStyle}>Valor (R$)*</label>
                <input name="amount" type="number" step="0.01" value={commonData.amount} onChange={handleCommonChange} placeholder="0.00" required style={inputStyle} />
            </fieldset>

            {/* Campos Dinâmicos */}
            {specificFields.length > 0 && (
                <fieldset style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
                    <legend>Detalhes Específicos</legend>
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

            {/* Campos Adicionais */}
            <fieldset style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
                <legend>Informações Adicionais</legend>
                <label style={labelStyle}>Observações</label>
                <textarea name="observations" value={commonData.observations} onChange={handleCommonChange} style={{...inputStyle, height: '80px'}} />               
                
                <label style={labelStyle}>Anexo</label>
                <input name="attachment" type="file" onChange={handleCommonChange} style={inputStyle} />
            </fieldset>
            
            <div style={{ marginTop: '24px' }}>
                <button type="button" onClick={onCancel}>Cancelar</button>
                <button type="submit" style={{ marginLeft: '12px' }}>Salvar Despesa</button>
            </div>
        </form>
    );
};

export default DynamicExpenseForm;