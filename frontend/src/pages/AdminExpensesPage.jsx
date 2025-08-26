import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AddExpenseModal from '../components/AddExpenseModal';

const AdminExpensesPage = () => {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    
    // Estados para filtros
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
        setLoading(true);
        axios.get('http://localhost:5145/api/projectexpenses/administrative')
            .then(response => {
                setExpenses(response.data || []);
                setFilteredExpenses(response.data || []);
            })
            .catch(error => {
                console.error("Erro ao buscar despesas da matriz:", error);
                setError("Erro ao carregar despesas da matriz.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Aplicar filtros
    useEffect(() => {
        let filtered = expenses;

        if (filters.startDate) {
            filtered = filtered.filter(expense => 
                new Date(expense.date) >= new Date(filters.startDate)
            );
        }

        if (filters.endDate) {
            filtered = filtered.filter(expense => 
                new Date(expense.date) <= new Date(filters.endDate)
            );
        }

        if (filters.costCenterId) {
            filtered = filtered.filter(expense => 
                expense.costCenterId === filters.costCenterId
            );
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
                .catch(error => {
                    console.error("Erro ao deletar despesa:", error);
                    toast.error("Falha ao deletar a despesa.");
                });
        }
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            startDate: '',
            endDate: '',
            costCenterId: ''
        });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    if (loading) return <div>Carregando despesas...</div>;
    if (error) return <div style={{ color: '#ef4444' }}>{error}</div>;

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
        }}>
            {/* Modal de Nova Despesa */}
            {isExpenseModalOpen && (
                <AddExpenseModal
                    onClose={() => setIsExpenseModalOpen(false)}
                    onExpenseAdded={handleExpenseAdded}
                    projectId={null}
                    contractId={null}
                />
            )}

            {/* Header da Seção */}
            <div style={{
                padding: '24px 32px',
                borderBottom: '1px solid #f1f5f9',
                backgroundColor: '#f8fafc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#1e293b',
                    margin: '0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    Despesas da Matriz
                    <span style={{
                        backgroundColor: '#e0e7ff',
                        color: '#3730a3',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: '700'
                    }}>
                        {filteredExpenses.length}
                    </span>
                </h2>

                <button
                    onClick={() => setIsExpenseModalOpen(true)}
                    style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 20px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                >
                    + Nova Despesa
                </button>
            </div>

            {/* Seção de Filtros */}
            <div style={{
                padding: '24px 32px',
                backgroundColor: '#fafbfc',
                borderBottom: '1px solid #f1f5f9'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    alignItems: 'end'
                }}>
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '6px'
                        }}>
                            Data Inicial
                        </label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '0.875rem',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '6px'
                        }}>
                            Data Final
                        </label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '0.875rem',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '6px'
                        }}>
                            Centro de Custo
                        </label>
                        <select
                            value={filters.costCenterId}
                            onChange={(e) => handleFilterChange('costCenterId', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '0.875rem',
                                boxSizing: 'border-box'
                            }}
                        >
                            <option value="">Todos os centros</option>
                            {costCenters.map(cc => (
                                <option key={cc.id} value={cc.id}>{cc.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <button
                            onClick={clearFilters}
                            style={{
                                backgroundColor: '#6b7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '8px 16px',
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#6b7280'}
                        >
                            Limpar Filtros
                        </button>
                    </div>
                </div>
            </div>

            {/* Lista de Despesas */}
            <div style={{ padding: '32px' }}>
                {filteredExpenses.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '48px',
                        color: '#64748b'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💰</div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>
                            {expenses.length === 0 ? 'Nenhuma despesa cadastrada' : 'Nenhuma despesa encontrada'}
                        </h3>
                        <p style={{ margin: '0' }}>
                            {expenses.length === 0 
                                ? 'Comece adicionando a primeira despesa da matriz.' 
                                : 'Tente ajustar os filtros para encontrar as despesas desejadas.'
                            }
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '12px' }}> {/* Reduzido de 16px para 12px */}
                        {filteredExpenses.map(expense => (
                            <div key={expense.id} style={{
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                padding: '16px', // Reduzido de 24px para 16px (redução de ~33%)
                                transition: 'all 0.2s ease',
                                backgroundColor: '#fafafa',
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr 1fr auto auto',
                                alignItems: 'center',
                                gap: '16px'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f8fafc';
                                    e.currentTarget.style.borderColor = '#c7d2fe';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(0, 0, 0, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#fafafa';
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                {/* Coluna 1: Descrição e Data */}
                                <div>
                                    <div style={{ 
                                        fontWeight: '600', 
                                        color: '#1e2d3b', 
                                        marginBottom: '2px', // Reduzido de 4px para 2px
                                        fontSize: '1rem' // Reduzido de 1.1rem para 1rem
                                    }}>
                                        {expense.description}
                                    </div>
                                    <div style={{ 
                                        fontSize: '0.8rem', // Reduzido de 0.875rem para 0.8rem
                                        color: '#64748b'
                                    }}>
                                        {new Date(expense.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                    </div>
                                </div>
                                
                                {/* Coluna 2: Centro de Custo */}
                                <div style={{ 
                                    fontSize: '0.85rem', // Reduzido de 0.9rem para 0.85rem
                                    color: '#475569',
                                    fontWeight: '500'
                                }}>
                                    {expense.costCenterName}
                                </div>
                                
                                {/* Coluna 3: Valor */}
                                <div style={{ 
                                    fontWeight: '700', 
                                    color: '#dc2626',
                                    fontSize: '1rem' // Reduzido de 1.1rem para 1rem
                                }}>
                                    {formatCurrency(expense.amount)}
                                </div>
                                
                                {/* Coluna 4: Anexo */}
                                <div>
                                    {expense.attachmentPath ? (
                                        <a 
                                            href={`http://localhost:5145/api/attachments/${expense.attachmentPath.replace('/uploads/', '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                color: '#3b82f6',
                                                textDecoration: 'none',
                                                fontSize: '0.8rem', // Reduzido de 0.875rem para 0.8rem
                                                fontWeight: '500',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                border: '1px solid #bfdbfe',
                                                backgroundColor: '#eff6ff'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = '#dbeafe';
                                                e.target.style.borderColor = '#93c5fd';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = '#eff6ff';
                                                e.target.style.borderColor = '#bfdbfe';
                                            }}
                                        >
                                            Anexo
                                        </a>
                                    ) : null}
                                </div>
                                
                                {/* Coluna 5: Ações */}
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Link to={`/expense/edit/${expense.id}`}>
                                        <button style={{
                                            backgroundColor: '#3b82f6',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '6px 12px',
                                            fontSize: '0.75rem',
                                            cursor: 'pointer'
                                        }}>
                                            ✏️
                                        </button>
                                    </Link>
                                    <button 
                                        onClick={() => handleDeleteExpense(expense.id)}
                                        style={{
                                            backgroundColor: '#ef4444',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '6px 12px',
                                            fontSize: '0.75rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminExpensesPage;