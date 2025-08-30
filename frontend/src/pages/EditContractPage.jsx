import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

import InvoicesManager from '../components/InvoicesManager';
import FormGroup from '../components/common/FormGroup';
import StyledInput from '../components/common/StyledInput';

const StyledTextarea = (props) => (
    <textarea className="form-textarea" {...props} />
);

const EditContractPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [projectInfo, setProjectInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchContractData = useCallback(() => {
        setLoading(true);
        axios.get(`http://localhost:5145/api/contracts/${id}`)
            .then(response => {
                const contract = response.data;
                setFormData({
                    ...contract,
                    startDate: contract.startDate ? contract.startDate.split('T')[0] : '',
                    endDate: contract.endDate ? contract.endDate.split('T')[0] : ''
                });
                return axios.get(`http://localhost:5145/api/projects/${contract.projectId}`);
            })
            .then(projectResponse => {
                setProjectInfo(projectResponse.data);
            })
            .catch(() => {
                setError('Não foi possível carregar os dados do contrato.');
                toast.error('Erro ao carregar dados.');
            })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        fetchContractData();
    }, [fetchContractData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const contractDto = {
            contractNumber: formData.contractNumber,
            title: formData.title,
            totalValue: parseFloat(formData.totalValue),
            downPaymentValue: parseFloat(formData.downPaymentValue) || 0,
            retentionValue: parseFloat(formData.retentionValue) || 0,
            startDate: formData.startDate,
            endDate: formData.endDate || null,
            observations: formData.observations || ''
        };

        const promise = axios.put(`http://localhost:5145/api/contracts/${id}`, contractDto);

        toast.promise(promise, {
            loading: 'Salvando alterações...',
            success: (res) => {
                navigate(`/project/${formData.projectId}`);
                return 'Contrato atualizado com sucesso!';
            },
            error: 'Falha ao atualizar o contrato.'
        }).finally(() => setSubmitting(false));
    };
    
    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    if (loading) return <div className="loading-state">Carregando dados do contrato...</div>;
    if (error) return <div className="error-state"><h3>{error}</h3></div>;
    if (!formData) return <div className="empty-state"><h3>Contrato não encontrado.</h3></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                 <div className="page-header-content">
                    <div>
                        <Link to={`/project/${formData.projectId}`} className="breadcrumb-link">
                            ← Voltar para a Obra
                        </Link>
                        <h1 className="page-title">✏️ Editando Contrato</h1>
                        <p className="page-subtitle">
                            Atualize os dados do contrato <strong>{formData.contractNumber}</strong>
                        </p>
                    </div>
                </div>
            </div>

            <div className="page-content">
                {projectInfo && (
                    <div className="info-card info-card-blue" style={{ marginBottom: '32px' }}>
                        <h3 className="info-card-title" style={{fontSize: '1.1rem'}}>🏗️ Informações da Obra</h3>
                        <div className="form-grid">
                            <div>
                                <span className="info-card-label">Nome:</span>
                                <div className="info-card-value" style={{fontSize: '1rem'}}>{projectInfo.contractor} - {projectInfo.name}</div>
                            </div>
                             <div>
                                <span className="info-card-label">CNO:</span>
                                <div className="info-card-value" style={{fontSize: '1rem'}}>{projectInfo.cno}</div>
                            </div>
                             <div>
                                <span className="info-card-label">Local:</span>
                                <div className="info-card-value" style={{fontSize: '1rem'}}>{projectInfo.city}/{projectInfo.state}</div>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="card">
                    <form onSubmit={handleSubmit}>
                        <div className="contract-header-display">
                            <div className="contract-header-icon">📄</div>
                            <div>
                                <h2 className="contract-header-title">{formData.contractNumber}</h2>
                                <p className="contract-header-subtitle">{formData.title}</p>
                                <span className="badge success" style={{fontSize: '1rem'}}>
                                    💰 {formatCurrency(formData.totalValue)}
                                </span>
                            </div>
                        </div>

                        <h3 className="section-divider">📋 Informações do Contrato</h3>
                        <div className="form-grid">
                            <FormGroup label="Número do Contrato">
                                <StyledInput type="text" name="contractNumber" value={formData.contractNumber} onChange={handleChange} required />
                            </FormGroup>
                            <FormGroup label="Título do Contrato">
                                <StyledInput type="text" name="title" value={formData.title} onChange={handleChange} required />
                            </FormGroup>
                            <FormGroup label="Valor Total (R$)" helpText="Use ponto (.) para decimais.">
                                <StyledInput type="number" step="0.01" name="totalValue" min="0" value={formData.totalValue} onChange={handleChange} required />
                            </FormGroup>
                            <FormGroup label="Valor Entrada (R$)">
                                <StyledInput type="number" step="0.01" name="downPaymentValue" min="0" value={formData.downPaymentValue} onChange={handleChange} />
                            </FormGroup>
                            <FormGroup label="Valor Retenção (R$)">
                                <StyledInput type="number" step="0.01" name="retentionValue" min="0" value={formData.retentionValue} onChange={handleChange} />
                            </FormGroup>
                        </div>
                        
                        <h3 className="section-divider">📅 Cronograma</h3>
                         <div className="form-grid">
                            <FormGroup label="Data de Início">
                                <StyledInput type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                            </FormGroup>
                            <FormGroup label="Data de Fim (Opcional)">
                                <StyledInput type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                            </FormGroup>
                        </div>

                        <h3 className="section-divider">📝 Observações</h3>
                        <FormGroup label="Observações do Contrato (Opcional)">
                             <StyledTextarea name="observations" value={formData.observations || ''} onChange={handleChange} rows="4" />
                        </FormGroup>

                        <div className="modal-footer" style={{marginTop: '32px'}}>
                            <Link to={`/project/${formData.projectId}`} className="form-button-secondary">
                                Cancelar
                            </Link>
                            <button type="submit" disabled={submitting} className="form-button">
                                {submitting ? '⏳ Salvando...' : '💾 Salvar Alterações'}
                            </button>
                        </div>
                    </form>
                </div>

                <InvoicesManager contractId={id} />
            </div>
        </div>
    );
};

export default EditContractPage;