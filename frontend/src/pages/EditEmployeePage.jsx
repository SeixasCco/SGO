import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

import FormGroup from '../components/common/FormGroup';
import StyledInput from '../components/common/StyledInput';

const EditEmployeePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchEmployeeData = useCallback(() => {
        axios.get(`http://localhost:5145/api/employees/${id}`)
            .then(response => {
                const employee = response.data;
                setFormData({
                    name: employee.name || '',
                    position: employee.position || '',
                    salary: employee.salary || '',
                    startDate: employee.startDate ? employee.startDate.split('T')[0] : '',
                    endDate: employee.endDate ? employee.endDate.split('T')[0] : '',
                    isActive: employee.isActive !== undefined ? employee.isActive : true
                });
            })
            .catch(() => {
                setError('Não foi possível carregar os dados do funcionário.');
                toast.error('Erro ao carregar os dados.');
            })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        fetchEmployeeData();
    }, [fetchEmployeeData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const employeeDto = {
            ...formData,
            salary: parseFloat(formData.salary),
            endDate: formData.endDate || null
        };

        const promise = axios.put(`http://localhost:5145/api/employees/${id}`, employeeDto);

        toast.promise(promise, {
            loading: 'Salvando alterações...',
            success: () => {
                navigate('/admin');
                return 'Funcionário atualizado com sucesso!';
            },
            error: 'Falha ao atualizar o funcionário.'
        }).finally(() => setSubmitting(false));
    };

    if (loading) return <div className="loading-state">Carregando dados...</div>;
    if (error) return <div className="error-state"><h3>{error}</h3></div>;
    if (!formData) return <div className="empty-state"><h3>Funcionário não encontrado.</h3></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-content">
                    <div>
                        <Link to="/admin" className="breadcrumb-link">
                            ← Voltar para o Módulo Administrativo
                        </Link>
                        <h1 className="page-title">✏️ Editando Funcionário</h1>
                        <p className="page-subtitle">
                            Atualize as informações de <strong>{formData.name}</strong>
                        </p>
                    </div>
                </div>
            </div>

            <div className="page-content">
                <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div className="employee-header-display">
                        <div className="employee-header-avatar">👤</div>
                        <div>
                            <h2 className="employee-header-name">{formData.name}</h2>
                            <p className="employee-header-position">{formData.position}</p>
                            <div className={`badge ${formData.isActive ? 'success' : 'error'}`}>
                                <div className={`status-dot ${formData.isActive ? 'active' : 'inactive'}`}></div>
                                {formData.isActive ? 'ATIVO' : 'INATIVO'}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <FormGroup label="Nome Completo">
                                <StyledInput type="text" name="name" value={formData.name} onChange={handleChange} required />
                            </FormGroup>
                            <FormGroup label="Cargo/Função">
                                <StyledInput type="text" name="position" value={formData.position} onChange={handleChange} required />
                            </FormGroup>
                            <FormGroup label="Salário (R$)">
                                <StyledInput type="number" step="0.01" min="0" name="salary" value={formData.salary} onChange={handleChange} required />
                            </FormGroup>
                             <FormGroup label="Data de Início">
                                <StyledInput type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                            </FormGroup>
                             <FormGroup label="Data Fim (Opcional)">
                                <StyledInput type="date" name="endDate" value={formData.endDate || ''} onChange={handleChange} />
                            </FormGroup>
                        </div>

                        <FormGroup>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="form-checkbox"
                                />
                                <span>Funcionário Ativo</span>
                                <span className="form-help-text" style={{marginLeft: '12px'}}>(Desmarque se o funcionário não está mais na empresa)</span>
                            </label>
                        </FormGroup>

                        <div className="modal-footer" style={{ marginTop: '32px', paddingTop: '24px' }}>
                            <Link to="/admin" className="form-button-secondary">
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

export default EditEmployeePage;