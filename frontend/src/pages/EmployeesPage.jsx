import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCompany } from '../context/CompanyContext';

import FormGroup from '../components/common/FormGroup';
import StyledInput from '../components/common/StyledInput';
import StatusBadge from '../components/common/StatusBadge';

const EmployeesPage = () => {
    const { selectedCompany } = useCompany();
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submittingForm, setSubmittingForm] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        position: '',
        startDate: new Date().toISOString().split('T')[0],
        salary: '',
        isActive: true
    });

    const [filters, setFilters] = useState({
        name: '',
        position: '',
        status: 'all'
    });

    const fetchEmployees = useCallback(() => {
        if (!selectedCompany) {
            setLoading(false);
            setEmployees([]); 
            return;
        }
        setLoading(true);       
        axios.get(`http://localhost:5145/api/employees`, { params: { companyId: selectedCompany.id } })
            .then(response => {
                setEmployees(response.data || []);
            })
            .catch(() => {
                setError("Erro ao carregar funcionários.");
                setEmployees([]); 
            })
            .finally(() => {
                setLoading(false);
            });
    }, [selectedCompany]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    useEffect(() => {
        let filtered = employees;
        if (filters.name) {
            filtered = filtered.filter(emp => emp.name.toLowerCase().includes(filters.name.toLowerCase()));
        }
        if (filters.position) {
            filtered = filtered.filter(emp => emp.position.toLowerCase().includes(filters.position.toLowerCase()));
        }
        if (filters.status === 'active') {
            filtered = filtered.filter(emp => emp.isActive);
        } else if (filters.status === 'inactive') {
            filtered = filtered.filter(emp => !emp.isActive);
        }
        setFilteredEmployees(filtered);
    }, [employees, filters]);

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const clearFilters = () => {
        setFilters({ name: '', position: '', status: 'all' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedCompany) {
            toast.error("Nenhuma empresa selecionada para cadastrar o funcionário.");
            return;
        }
        setSubmittingForm(true);

        const employeeDto = {
            ...formData,
            salary: parseFloat(formData.salary),
            companyId: selectedCompany.id
        };

        const promise = axios.post('http://localhost:5145/api/employees', employeeDto);

        toast.promise(promise, {
            loading: 'Cadastrando funcionário...',
            success: () => {
                setFormData({ name: '', position: '', startDate: new Date().toISOString().split('T')[0], salary: '', isActive: true });
                fetchEmployees();
                return 'Funcionário cadastrado com sucesso!';
            },
            error: (err) => err.response?.data?.message || 'Falha ao cadastrar funcionário.'
        }).finally(() => setSubmittingForm(false));
    };

    const handleDeleteEmployee = (id) => {
        if (window.confirm('Tem certeza que deseja deletar este funcionário?')) {
            const promise = axios.delete(`http://localhost:5145/api/employees/${id}`);
            toast.promise(promise, {
                loading: 'Deletando...',
                success: () => {
                    fetchEmployees();
                    return 'Funcionário deletado com sucesso!';
                },
                error: (err) => err.response?.data || 'Erro ao deletar funcionário.'
            });
        }
    };

    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    if (loading) return <div className="loading-state">Carregando...</div>;
    if (error) return <div className="error-state"><h3>{error}</h3></div>;

    if (!selectedCompany && !loading) {
        return (
            <div className="card empty-state">
                <div className="empty-state-icon">🏢</div>
                <h3>Nenhuma Empresa Selecionada</h3>
                <p>Por favor, selecione uma empresa na barra de navegação ou cadastre uma nova em "Gestão de Empresas".</p>
            </div>
        );
    }
    
    return (
        <>
            <div className="card">
                <h2 className="section-title">Cadastrar Novo Funcionário</h2>
                <form onSubmit={handleSubmit} style={{marginTop: '24px'}}>
                    <div className="employee-form-grid">
                        <FormGroup label="Nome Completo"><StyledInput type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="Ex: João da Silva"/></FormGroup>
                        <FormGroup label="Cargo/Função"><StyledInput type="text" name="position" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} required placeholder="Ex: Engenheiro Civil"/></FormGroup>
                        <FormGroup label="Salário (R$)"><StyledInput type="number" step="0.01" min="0" name="salary" value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} required placeholder="5000.00"/></FormGroup>
                        <FormGroup label="Data de Contratação"><StyledInput type="date" name="startDate" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required /></FormGroup>
                    </div>
                    <button type="submit" disabled={submittingForm} className="form-button" style={{marginTop: '16px'}}>
                        {submittingForm ? 'Salvando...' : 'Salvar Funcionário'}
                    </button>
                </form>
            </div>

            <div className="card">
                <div className="section-header">
                    <h2 className="section-title">
                        Funcionários Cadastrados <span className="count-badge">{filteredEmployees.length}</span>
                    </h2>
                </div>
                <div className="filters-section">
                    <div className="filters-grid">
                        <FormGroup label="Nome"><StyledInput type="text" placeholder="Filtrar por nome..." value={filters.name} onChange={(e) => handleFilterChange('name', e.target.value)} /></FormGroup>
                        <FormGroup label="Cargo"><StyledInput type="text" placeholder="Filtrar por cargo..." value={filters.position} onChange={(e) => handleFilterChange('position', e.target.value)} /></FormGroup>
                        <FormGroup label="Status">
                            <select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)} className="form-select">
                                <option value="all">Todos</option>
                                <option value="active">Ativos</option>
                                <option value="inactive">Inativos</option>
                            </select>
                        </FormGroup>
                        <button onClick={clearFilters} className="form-button-secondary">Limpar Filtros</button>
                    </div>
                </div>

                <div className="section-body">
                    {filteredEmployees.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">👤</div>
                            <h3>{employees.length === 0 ? 'Nenhum funcionário cadastrado' : 'Nenhum funcionário encontrado'}</h3>
                            <p>{employees.length === 0 ? 'Comece cadastrando o primeiro funcionário para esta empresa.' : 'Tente ajustar os filtros.'}</p>
                        </div>
                    ) : (
                        <div className="employee-list">
                            {filteredEmployees.map(emp => (
                                <div key={emp.id} className="employee-card">
                                    <div className="employee-card-info">
                                        <div className="employee-card-avatar">👤</div>
                                        <div>
                                            <h3 className="employee-card-name">{emp.name}</h3>
                                            <p className="employee-card-position">{emp.position}</p>
                                        </div>
                                    </div>
                                    <div className="employee-card-detail employee-card-salary">
                                        <div className="employee-card-detail-label">SALÁRIO</div>
                                        <div className="employee-card-detail-value">{formatCurrency(emp.salary)}</div>
                                    </div>
                                    <div className="employee-card-detail employee-card-startdate">
                                        <div className="employee-card-detail-label">INÍCIO</div>
                                        <div className="employee-card-detail-value">{new Date(emp.startDate).toLocaleDateString('pt-BR')}</div>
                                    </div>
                                    <div className="employee-card-status">
                                        <StatusBadge status={emp.isActive ? 'active' : 'inactive'} />
                                    </div>
                                    <div className="employee-card-actions">
                                        <Link to={`/employee/edit/${emp.id}`}>
                                            <button className="form-button small">Editar</button>
                                        </Link>
                                        <button onClick={() => handleDeleteEmployee(emp.id)} className="form-button-secondary small danger">Deletar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default EmployeesPage;