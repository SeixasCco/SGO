import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import AddExpenseModal from '../components/AddExpenseModal';
import FormGroup from '../components/common/FormGroup';
import StyledInput from '../components/common/StyledInput';
import { useCompany } from '../context/CompanyContext';

const AdminExpenseRow = ({ expense, formatCurrency, onDelete }) => (
    <div className="expense-row-card">
        <div className="expense-info">
            <div className="expense-description">{expense.description}</div>
            <div className="expense-date">
                📅 {new Date(expense.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
            </div>
        </div>
        <div className="expense-cost-center">{expense.costCenterName}</div>
        <div className="expense-amount">{formatCurrency(expense.amount)}</div>
        <div className="expense-attachment">
            {expense.attachmentPath && (
                <a
                    href={`http://localhost:5145/api/attachments/${expense.attachmentPath.replace('/uploads/', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="attachment-link"
                >
                    📎 Anexo
                </a>
            )}
        </div>
        <div className="expense-actions">
            <Link to={`/expense/edit/${expense.id}`}>
                <button className="action-button-edit">✏️</button>
            </Link>
            <button onClick={() => onDelete(expense.id)} className="action-button-delete">
                🗑️
            </button>
        </div>
    </div>
);

const AdminExpensesPage = () => {
    const [expenses, setExpenses] = useState([]);
    const { selectedCompany } = useCompany();
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [costCenters, setCostCenters] = useState([]);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        costCenterId: ''
    });

    const fetchCostCenters = useCallback(() => {
        axios.get('http://localhost:5145/api/costcenters')
            .then(response => setCostCenters(response.data || []))
            .catch(err => console.error('Erro ao carregar centros de custo:', err));
    }, []);

    const fetchMatrixExpenses = useCallback(() => {        
        if (!selectedCompany) {
            setLoading(false);
            setExpenses([]);
            return;
        }
        setLoading(true);       
        axios.get('http://localhost:5145/api/projectexpenses/administrative', { params: { companyId: selectedCompany.id } })
            .then(response => {
                setExpenses(response.data || []);
                setFilteredExpenses(response.data || []);
            })
            .catch(error => {
                setError("Erro ao carregar despesas da matriz.");
            })
            .finally(() => setLoading(false));
    }, [selectedCompany]);

    useEffect(() => {
        let filtered = expenses;
        if (filters.startDate) {
            filtered = filtered.filter(exp => new Date(exp.date) >= new Date(filters.startDate));
        }
        if (filters.endDate) {
            filtered = filtered.filter(exp => new Date(exp.date) <= new Date(filters.endDate));
        }
        if (filters.costCenterId) {
            filtered = filtered.filter(exp => exp.costCenterId === filters.costCenterId);
        }
        setFilteredExpenses(filtered);
    }, [expenses, filters]);

    useEffect(() => {
        fetchMatrixExpenses();
        fetchCostCenters();
    }, [fetchMatrixExpenses, fetchCostCenters]);

    const handleExpenseAdded = () => {
        setIsExpenseModalOpen(false);
        fetchMatrixExpenses();
        toast.success('Despesa da matriz lançada com sucesso!');
    };

    const handleDeleteExpense = (expenseId) => {
        if (window.confirm("Tem certeza que deseja deletar esta despesa?")) {
            axios.delete(`http://localhost:5145/api/projectexpenses/${expenseId}`)
                .then(() => {
                    toast.success("Despesa deletada com sucesso!");
                    fetchMatrixExpenses();
                })
                .catch(() => toast.error("Falha ao deletar a despesa."));
        }
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const clearFilters = () => {
        setFilters({ startDate: '', endDate: '', costCenterId: '' });
    };

    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    if (loading) return <div className="loading-state">Carregando despesas...</div>;
    if (error) return <div className="form-error-message">{error}</div>;

    return (
        <div className="card">
            {isExpenseModalOpen && (
                <AddExpenseModal
                    onClose={() => setIsExpenseModalOpen(false)}
                    onExpenseAdded={handleExpenseAdded}
                    projectId={null}
                    contractId={null}
                    companyId={selectedCompany.id}
                />
            )}

            <div className="section-header">
                <h2 className="section-title">
                    🏢 Despesas da Matriz
                    <span className="count-badge">{filteredExpenses.length}</span>
                </h2>
                <button onClick={() => setIsExpenseModalOpen(true)} className="form-button">
                    + Nova Despesa
                </button>
            </div>

            <div className="filters-section">
                <div className="form-grid">
                    <FormGroup label="Data Inicial">
                        <StyledInput type="date" value={filters.startDate} onChange={(e) => handleFilterChange('startDate', e.target.value)} />
                    </FormGroup>
                    <FormGroup label="Data Final">
                        <StyledInput type="date" value={filters.endDate} onChange={(e) => handleFilterChange('endDate', e.target.value)} />
                    </FormGroup>
                    <FormGroup label="Centro de Custo">
                        <select value={filters.costCenterId} onChange={(e) => handleFilterChange('costCenterId', e.target.value)} className="form-select">
                            <option value="">Todos os centros</option>
                            {costCenters.map(cc => (
                                <option key={cc.id} value={cc.id}>{cc.name}</option>
                            ))}
                        </select>
                    </FormGroup>
                    <div style={{ alignSelf: 'flex-end' }}>
                        <button onClick={clearFilters} className="form-button-secondary">
                            Limpar Filtros
                        </button>
                    </div>
                </div>
            </div>

            <div className="section-body">
                {filteredExpenses.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">💰</div>
                        <h3 className="empty-state-title">
                            {expenses.length === 0 ? 'Nenhuma despesa cadastrada' : 'Nenhuma despesa encontrada'}
                        </h3>
                        <p className="empty-state-description">
                            {expenses.length === 0 ? 'Comece adicionando a primeira despesa da matriz.' : 'Tente ajustar os filtros para encontrar as despesas.'}
                        </p>
                    </div>
                ) : (
                    <div className="expenses-list">
                        {filteredExpenses.map(expense => (
                            <AdminExpenseRow
                                key={expense.id}
                                expense={expense}
                                formatCurrency={formatCurrency}
                                onDelete={handleDeleteExpense}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminExpensesPage;