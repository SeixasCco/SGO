import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

import { useCompany } from '../context/CompanyContext';
import PageContainer from '../components/common/PageContainer';
import BreadCrumb from '../components/common/BreadCrumb';
import FormGroup from '../components/common/FormGroup';
import StyledInput from '../components/common/StyledInput';
import LoadingState from '../components/common/LoadingState';

// Componentes estilizados
const StyledTextarea = (props) => (
    <textarea className="form-textarea" {...props} />
);

const StyledSelect = React.forwardRef((props, ref) => (
    <select className="form-select" ref={ref} {...props} />
));

const EditWorkPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { companies } = useCompany();
    
    const [formData, setFormData] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchWorkData = () => {
            const promise = axios.get(`http://localhost:5145/api/projects/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            toast.promise(promise, {
                loading: 'Carregando dados da obra...',
                success: (response) => {
                    const data = response.data;
                    const formattedStartDate = data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '';
                    const formattedEndDate = data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '';
                    
                    setFormData({
                        ...data,
                        startDate: formattedStartDate,
                        endDate: formattedEndDate,
                    });
                    return 'Dados carregados!';
                },
                error: 'Falha ao buscar dados da obra.'
            });
        };

        fetchWorkData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.companyId) {
            toast.error("Por favor, selecione uma matriz.");
            return;
        }
        setSubmitting(true);
        const projectDto = { ...formData, id: id, endDate: formData.endDate || null };

        const promise = axios.put(`http://localhost:5145/api/projects/${id}`, projectDto, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        toast.promise(promise, {
            loading: 'Salvando alterações...',
            success: () => {
                setTimeout(() => navigate(`/projects/${id}`), 1500);
                return 'Obra atualizada com sucesso!';
            },
            error: 'Falha ao atualizar a obra.'
        }).finally(() => setSubmitting(false));
    };

    if (!formData) {
        return <PageContainer><LoadingState/></PageContainer>;
    }

    return (
        <PageContainer>
            <BreadCrumb
                items={[
                    { label: 'Obras', path: '/projects' },
                    { label: formData.name, path: `/projects/${id}` },
                    { label: 'Editar' }
                ]}
            />
            <div className="card">
                <h3 className="card-header">✏️ Editar Obra</h3>
                <form onSubmit={handleSubmit}>
                    <h3 className="section-divider">📋 Informações Básicas</h3>
                    <div className="form-grid">
                        <FormGroup label="Matriz *">
                            <StyledSelect name="companyId" value={formData.companyId} onChange={handleChange} required>
                                <option value="">Selecione uma Matriz</option>
                                {companies.map(company => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </StyledSelect>
                        </FormGroup>

                        <FormGroup label="Nome da Obra *">
                            <StyledInput type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup label="CNPJ *">
                            <StyledInput type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup label="Contratante *">
                            <StyledInput type="text" name="contractor" value={formData.contractor} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup label="Tomador do Serviço *">
                            <StyledInput type="text" name="serviceTaker" value={formData.serviceTaker} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup label="Responsável *">
                            <StyledInput type="text" name="responsible" value={formData.responsible} onChange={handleChange} required />
                        </FormGroup>
                    </div>

                    <h3 className="section-divider">📍 Localização</h3>
                    <div className="form-grid">
                        <FormGroup label="Cidade *">
                            <StyledInput type="text" name="city" value={formData.city} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup label="Estado *">
                            <StyledInput type="text" name="state" value={formData.state} onChange={handleChange} maxLength="2" required />
                        </FormGroup>
                        <div style={{gridColumn: '1 / -1'}}>
                            <FormGroup label="Endereço">
                                <StyledInput type="text" name="address" value={formData.address} onChange={handleChange} />
                            </FormGroup>
                        </div>
                    </div>

                    <h3 className="section-divider">📅 Cronograma</h3>
                    <div className="form-grid">
                        <FormGroup label="Data Início *">
                            <StyledInput type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup label="Data Fim">
                            <StyledInput type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                        </FormGroup>
                    </div>

                    <h3 className="section-divider">📝 Descrição</h3>
                    <FormGroup label="Descrição">
                        <StyledTextarea
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    
                    <div className="modal-footer" style={{marginTop: '32px'}}>
                        <button type="submit" disabled={submitting} className="form-button">
                            {submitting ? '⏳ Salvando...' : '💾 Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </PageContainer>
    );
};

export default EditWorkPage;