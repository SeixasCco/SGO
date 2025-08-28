import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

import FormGroup from '../components/common/FormGroup';
import StyledInput from '../components/common/StyledInput';
import { expenseFormMap } from '../config/expenseFormMap';

const EditExpensePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [projectInfo, setProjectInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // ADICIONADO: Declaração dos states para os campos dinâmicos
    const [specificFields, setSpecificFields] = useState([]);
    const [detailsData, setDetailsData] = useState({});

    const fetchExpenseData = useCallback(() => {
        setLoading(true);
        axios.get(`http://localhost:5145/api/projectexpenses/${id}`)
            .then(response => {
                const expense = response.data;
                expense.date = new Date(expense.date).toISOString().split('T')[0];
                setFormData(expense);

                if (expense.costCenterId) {
                    const fields = expenseFormMap[expense.costCenterId] || [];
                    setSpecificFields(fields);

                    if (expense.detailsJson) {
                        setDetailsData(JSON.parse(expense.detailsJson));
                    }
                }
                if (expense.projectId) {
                    return axios.get(`http://localhost:5145/api/projects/${expense.projectId}`);
                }
            })
            .then(projectResponse => {
                if (projectResponse) {
                    setProjectInfo(projectResponse.data);
                }
            })
            .catch(() => {
                setError('Não foi possível carregar os dados da despesa.');
                toast.error('Erro ao carregar dados.');
            })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        fetchExpenseData();
    }, [fetchExpenseData]);

    const handleCommonChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleDetailsChange = (e) => {
        const { name, value } = e.target;
        setDetailsData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const expenseDto = {
            ...formData,
            amount: parseFloat(formData.amount),
            detailsJson: JSON.stringify(detailsData)
        };

        const promise = axios.put(`http://localhost:5145/api/projectexpenses/${id}`, expenseDto);

        toast.promise(promise, {
            loading: 'Atualizando despesa...',
            success: () => {
                const destination = formData.projectId ? `/project/${formData.projectId}` : '/admin';
                navigate(destination);
                return 'Despesa atualizada com sucesso!';
            },
            error: 'Falha ao atualizar a despesa.'
        }).finally(() => setSubmitting(false));
    };

    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    if (loading) return <div className="loading-state">Carregando dados da despesa...</div>;
    if (error) return <div className="error-state"><h3>{error}</h3></div>;
    if (!formData) return <div className="empty-state"><h3>Despesa não encontrada.</h3></div>;

    const backLink = formData.projectId ? `/project/${formData.projectId}` : '/admin';

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-content">
                    <div>
                        <Link to={backLink} className="breadcrumb-link">
                            ← Voltar
                        </Link>
                        <h1 className="page-title">✏️ Editando Despesa</h1>
                        <p className="page-subtitle">
                            Atualize os dados da despesa <strong>{formData.description}</strong>
                        </p>
                    </div>
                </div>
            </div>

            <div className="page-content">
                {projectInfo && (
                    <div className="info-card info-card-green" style={{ marginBottom: '32px' }}>
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
                        </div>
                    </div>
                )}

                <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div className="expense-header-display">
                         <div className="expense-header-icon">💰</div>
                         <div>
                            <h2 className="expense-header-title">{formData.description}</h2>
                            <div className="expense-header-badges">
                                <span className="badge warning">💵 {formatCurrency(formData.amount)}</span>
                                <span className="badge info">📅 {new Date(formData.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                                <span className="badge purple">🏷️ {formData.costCenter?.name || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div style={{ gridColumn: '1 / -1' }}>
                                <FormGroup label="Descrição da Despesa">
                                    <StyledInput type="text" name="description" value={formData.description} onChange={handleCommonChange} required />
                                </FormGroup>
                            </div>
                            <FormGroup label="Valor (R$)">
                                <StyledInput type="number" step="0.01" name="amount" value={formData.amount} min="0" onChange={handleCommonChange} required />
                            </FormGroup>
                            <FormGroup label="Data da Despesa">
                                <StyledInput type="date" name="date" value={formData.date} onChange={handleCommonChange} required />
                            </FormGroup>
                            <FormGroup label="Centro de Custo">
                                 <StyledInput type="text" value={formData.costCenter?.name || 'Não informado'} disabled />
                            </FormGroup>
                        </div>
                        
                        {specificFields.length > 0 && (
                            <div className="form-section" style={{ padding: '20px', marginTop: '24px' }}>
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

                        {formData.attachmentPath && (
                            <div className="info-card info-card-blue" style={{ marginTop: '24px' }}>
                                <h4 className="info-card-title" style={{fontSize: '1rem'}}>📎 Anexo da Despesa</h4>
                                <a href={`http://localhost:5145${formData.attachmentPath}`} target="_blank" rel="noopener noreferrer" className="form-button">
                                    👁️ Visualizar Anexo
                                </a>
                            </div>
                        )}

                        <div className="modal-footer" style={{ marginTop: '32px' }}>
                            <Link to={backLink} className="form-button-secondary">
                                Cancelar
                            </Link>
                            <button type="submit" disabled={submitting} className="form-button">
                                {submitting ? '⏳ Salvando...' : '💾 Salvar Alterações'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditExpensePage;