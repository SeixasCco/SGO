import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

import FormGroup from '../components/common/FormGroup';
import StyledInput from '../components/common/StyledInput';
import StatusBadge from '../components/common/StatusBadge';

const StyledTextarea = (props) => (
    <textarea className="form-textarea" {...props} />
);

const EditWorkPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchProjectData = useCallback(() => {
        axios.get(`http://localhost:5145/api/projects/${id}`)
            .then(response => {
                const project = response.data;
                setFormData({
                    name: project.name || '',
                    contractor: project.contractor || '',
                    cno: project.cno || '',
                    serviceTaker: project.serviceTaker || '',
                    responsible: project.responsible || '',
                    city: project.city || '',
                    state: project.state || '',
                    address: project.address || '',
                    description: project.description || '',
                    startDate: project.startDate ? project.startDate.split('T')[0] : '',
                    endDate: project.endDate ? project.endDate.split('T')[0] : '',
                    status: project.status || 2
                });
            })
            .catch(() => {
                setError('Não foi possível carregar os dados da obra.');
                toast.error('Erro ao carregar os dados da obra.');
            })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        fetchProjectData();
    }, [fetchProjectData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const projectDto = { ...formData, endDate: formData.endDate || null };

        const promise = axios.put(`http://localhost:5145/api/projects/${id}`, projectDto);

        toast.promise(promise, {
            loading: 'Atualizando dados da obra...',
            success: () => {
                navigate('/projects');
                return 'Obra atualizada com sucesso!';
            },
            error: 'Falha ao atualizar a obra.'
        }).finally(() => setSubmitting(false));
    };

    if (loading) return <div className="loading-state">Carregando dados para edição...</div>;
    if (error) return <div className="error-state"><h3>{error}</h3></div>;
    if (!formData) return <div className="empty-state"><h3>Obra não encontrada.</h3></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-content">
                     <div>
                        <Link to="/projects" className="breadcrumb-link">
                            ← Voltar para Lista de Obras
                        </Link>
                        <h1 className="page-title">✏️ Editando Obra</h1>
                        <p className="page-subtitle">
                            <strong>{formData.name}</strong>
                            <StatusBadge status={parseInt(formData.status)} />
                        </p>
                    </div>
                </div>
            </div>

            <div className="page-content">
                <div className="card">
                    <div className="work-header-display">
                        <div className="work-header-icon">🏗️</div>
                        <div>
                            <h2 className="work-header-title">{formData.serviceTaker} - {formData.contractor} - {formData.name}</h2>
                            <p className="work-header-subtitle">📍 {formData.city}/{formData.state}</p>
                            <span className="work-header-cno">🔢 CNO: {formData.cno}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <h3 className="section-divider">📋 Informações Básicas</h3>
                        <div className="form-grid">
                            <FormGroup label="CNO (Número da Obra)">
                                <StyledInput type="text" name="cno" value={formData.cno} onChange={handleChange} required />
                            </FormGroup>
                            <FormGroup label="Nome da Obra">
                                <StyledInput type="text" name="name" value={formData.name} onChange={handleChange} required />
                            </FormGroup>
                             <FormGroup label="Contratante">
                                <StyledInput type="text" name="contractor" value={formData.contractor} onChange={handleChange} required />
                            </FormGroup>
                             <FormGroup label="Tomador do Serviço">
                                <StyledInput type="text" name="serviceTaker" value={formData.serviceTaker} onChange={handleChange} required />
                            </FormGroup>
                             <FormGroup label="Responsável pela Obra">
                                <StyledInput type="text" name="responsible" value={formData.responsible} onChange={handleChange} required />
                            </FormGroup>
                        </div>

                        <h3 className="section-divider">📍 Localização</h3>
                         <div className="form-grid">
                             <FormGroup label="Cidade">
                                <StyledInput type="text" name="city" value={formData.city} onChange={handleChange} required />
                            </FormGroup>
                             <FormGroup label="Estado (UF)">
                                <StyledInput type="text" name="state" value={formData.state} onChange={handleChange} maxLength="2" required />
                            </FormGroup>
                            <div style={{gridColumn: '1 / -1'}}>
                                <FormGroup label="Endereço Completo (Opcional)">
                                    <StyledInput type="text" name="address" value={formData.address} onChange={handleChange} />
                                </FormGroup>
                            </div>
                        </div>

                        <h3 className="section-divider">📅 Cronograma e Status</h3>
                        <div className="form-grid">
                             <FormGroup label="Data de Início">
                                <StyledInput type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                            </FormGroup>
                             <FormGroup label="Data de Fim (Opcional)">
                                <StyledInput type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                            </FormGroup>
                             <FormGroup label="Status da Obra">
                                <select name="status" value={formData.status} onChange={handleChange} required className="form-select">
                                    <option value={1}>Planejamento</option>
                                    <option value={2}>Ativa</option>
                                    <option value={3}>Pausada</option>
                                    <option value={4}>Concluída</option>
                                    <option value={5}>Aditivo</option>
                                    <option value={6}>Cancelada</option>
                                </select>
                            </FormGroup>
                        </div>
                        
                        <h3 className="section-divider">📝 Descrição</h3>
                        <FormGroup label="Descrição da Obra (Opcional)">
                            <StyledTextarea name="description" value={formData.description} onChange={handleChange} rows="4" />
                        </FormGroup>
                        
                        <div className="modal-footer" style={{marginTop: '32px'}}>
                             <Link to="/projects" className="form-button-secondary">
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

export default EditWorkPage;