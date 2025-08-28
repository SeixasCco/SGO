import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import DynamicExpenseForm from './DynamicExpenseForm';
import FormGroup from './common/FormGroup';

const AddExpenseModal = ({ onClose, onExpenseAdded, projectId, contractId, companyId  }) => {
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
            } catch (err) {
                toast.error('Falha ao enviar o anexo.');
                setSubmitting(false);
                return;
            }
        }

        const finalData = {
            ...formData,
            costCenterId: selectedCostCenterId,
            projectId: projectId || null,
            contractId: contractId || null,
            attachmentPath: attachmentPath,
            companyId: companyId
        };
        
        const promise = axios.post('http://localhost:5145/api/projectexpenses', finalData);

        toast.promise(promise, {
            loading: 'Lançando despesa...',
            success: () => {
                onExpenseAdded(); 
                return 'Despesa lançada com sucesso!';
            },
            error: (err) => err.response?.data?.message || "Falha ao lançar despesa."
        }).finally(() => setSubmitting(false));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2 className="modal-title">
                        💸 Lançar Nova Despesa {projectId ? '(Obra)' : '(Matriz)'}
                    </h2>
                    <button onClick={onClose} className="modal-close-button">×</button>
                </div>

                <div className="modal-body">
                    <div className="form-section">
                        <FormGroup label="1. Selecione o Centro de Custo *">
                            <select
                                value={selectedCostCenterId}
                                onChange={(e) => setSelectedCostCenterId(e.target.value)}
                                className="form-select"
                            >
                                <option value="">Selecione...</option>
                                {costCenters.map(cc => (
                                    <option key={cc.id} value={cc.id}>{cc.name}</option>
                                ))}
                            </select>
                        </FormGroup>
                    </div>

                    {selectedCostCenterId && (
                        <>
                            <h3 className="section-divider" style={{marginTop: 0}}>2. Preencha os Dados da Despesa</h3>
                            <DynamicExpenseForm
                                costCenterId={selectedCostCenterId}
                                onSubmit={handleSubmit}
                                onCancel={onClose}
                                submitting={submitting}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddExpenseModal;