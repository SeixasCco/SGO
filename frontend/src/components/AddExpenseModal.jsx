import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import DynamicExpenseForm from './DynamicExpenseForm'; 

const AddExpenseModal = ({ onClose, onExpenseAdded, projectId, contractId }) => {
    const [costCenters, setCostCenters] = useState([]);
    const [selectedCostCenterId, setSelectedCostCenterId] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {        
        axios.get('http://localhost:5145/api/costcenters')
            .then(response => setCostCenters(response.data || []))
            .catch(err => toast.error('Não foi possível carregar os centros de custo.'));
    }, []);

    const handleSubmit = (formData) => {
        setSubmitting(true);
        const finalData = {
            ...formData, 
            costCenterId: selectedCostCenterId,
            projectId: projectId || null,
            contractId: contractId || null, 
        };

        const postData = new FormData();
        Object.keys(finalData).forEach(key => {
            if (key === 'details') {               
                postData.append(key, JSON.stringify(finalData[key]));
            } else if (finalData[key] !== null && finalData[key] !== undefined) {
                postData.append(key, finalData[key]);
            }
        });
        
        axios.post('http://localhost:5145/api/projectexpenses', finalData)
            .then(() => {
                toast.success('Despesa lançada com sucesso!');
                onExpenseAdded();
            })
            .catch(err => {
                const message = err.response?.data?.message || "Falha ao lançar despesa.";
                toast.error(message);
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    return (
        <div style={{ /* Estilos do Overlay */ }}>
            <div style={{ /* Estilos do Modal */ }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Lançar Nova Despesa {projectId ? '(Obra)' : '(Matriz)'}</h2>
                    <button onClick={onClose}>✖️</button>
                </div>

                {/* Passo 1: Selecionar Centro de Custo */}
                <div style={{ margin: '20px 0' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>1. Selecione o Centro de Custo</label>
                    <select
                        value={selectedCostCenterId}
                        onChange={(e) => setSelectedCostCenterId(e.target.value)}
                        style={{ width: '100%', padding: '10px' }}
                    >
                        <option value="">Selecione...</option>
                        {costCenters.map(cc => (
                            <option key={cc.id} value={cc.id}>{cc.name}</option>
                        ))}
                    </select>
                </div>

                {/* Passo 2: Renderizar o Formulário Dinâmico */}
                {selectedCostCenterId && (
                    <DynamicExpenseForm
                        costCenterId={selectedCostCenterId}
                        onSubmit={handleSubmit}
                        onCancel={onClose}
                    />
                )}
            </div>
        </div>
    );
};

export default AddExpenseModal;