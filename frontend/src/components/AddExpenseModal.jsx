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

    const handleSubmit = async (formData) => {
        setSubmitting(true);

        let attachmentPath = null;

        if (formData.attachment) {
            const uploadData = new FormData();
            uploadData.append('file', formData.attachment);

            try {
                const uploadResponse = await axios.post('http://localhost:5145/api/attachments/upload', uploadData);
                attachmentPath = uploadResponse.data.filePath;
                console.log('Anexo enviado:', attachmentPath);
            } catch (err) {
                toast.error('Falha ao enviar o anexo.');
                setSubmitting(false);
                return;
            }
        }

        const finalData = {
            description: formData.description,
            amount: formData.amount,
            date: formData.date,
            observations: formData.observations,
            details: formData.details,
            costCenterId: selectedCostCenterId,
            projectId: projectId || null,
            contractId: contractId || null,
            attachmentPath: attachmentPath
        };

        console.log('Dados finais:', finalData);

        try {
            await axios.post('http://localhost:5145/api/projectexpenses', finalData);
            toast.success('Despesa lançada com sucesso!');
            onExpenseAdded();
        } catch (err) {
            const message = err.response?.data?.message || "Falha ao lançar despesa.";
            toast.error(message);
            console.error('Erro:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '32px',
                width: '90%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <h2 style={{ margin: 0 }}>
                        Lançar Nova Despesa {projectId ? '(Obra)' : '(Matriz)'}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: '#666'
                        }}
                    >
                        ×
                    </button>
                </div>

                <div style={{ margin: '20px 0' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 'bold'
                    }}>
                        1. Selecione o Centro de Custo *
                    </label>
                    <select
                        value={selectedCostCenterId}
                        onChange={(e) => setSelectedCostCenterId(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                    >
                        <option value="">Selecione...</option>
                        {costCenters.map(cc => (
                            <option key={cc.id} value={cc.id}>{cc.name}</option>
                        ))}
                    </select>
                </div>

                {selectedCostCenterId && (
                    <DynamicExpenseForm
                        costCenterId={selectedCostCenterId}
                        onSubmit={handleSubmit}
                        onCancel={onClose}
                        submitting={submitting}
                    />
                )}
            </div>
        </div>
    );
};

export default AddExpenseModal;
