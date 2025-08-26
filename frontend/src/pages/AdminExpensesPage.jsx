import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AddExpenseModal from '../components/AddExpenseModal';
import { Link } from 'react-router-dom';

const AdminExpensesPage = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchAdminExpenses = () => {
        setLoading(true);
        axios.get('http://localhost:5145/api/projectexpenses/administrative')
            .then(response => {
                setExpenses(response.data || []);
            })
            .catch(err => {
                toast.error("Falha ao carregar despesas administrativas.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchAdminExpenses();
    }, []);

    const handleDeleteExpense = (expenseId) => {
        toast((t) => (
            <div>
                <p><strong>Deletar esta despesa?</strong></p>
                <p>Esta ação não pode ser desfeita.</p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button onClick={() => toast.dismiss(t.id)}>Cancelar</button>
                    <button onClick={() => {
                        toast.dismiss(t.id);
                        axios.delete(`http://localhost:5145/api/projectexpenses/${expenseId}`)
                            .then(() => {
                                toast.success("Despesa deletada com sucesso!");
                                fetchAdminExpenses();
                            })
                            .catch(err => toast.error("Falha ao deletar a despesa."));
                    }}>Deletar</button>
                </div>
            </div>
        ), { duration: 6000 });
    };

    const handleExpenseAdded = () => {
        setIsModalOpen(false);
        fetchAdminExpenses();
    };

    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

    return (
        <div>
            {isModalOpen && (
                <AddExpenseModal
                    onClose={() => setIsModalOpen(false)}
                    onExpenseAdded={handleExpenseAdded}
                />
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2>Despesas da Matriz</h2>
                <button onClick={() => setIsModalOpen(true)}>+ Lançar Despesa</button>
            </div>
            {loading ? <p>Carregando despesas...</p> : (
                <div>
                    <table style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Descrição</th>
                                <th>Centro de Custo</th>
                                <th>Valor</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map(expense => (
                                <tr key={expense.id}>
                                    <td>{formatDate(expense.date)}</td>
                                    <td>{expense.description}</td>
                                    <td>{expense.costCenterName}</td>
                                    <td>{formatCurrency(expense.amount)}</td>
                                    <td>
                                        {expense.hasAttachment && (
                                            <a href={`http://localhost:5145/api/attachments/${expense.attachmentPath}`} target="_blank" rel="noopener noreferrer">📎</a>
                                        )}
                                        <Link to={`/expense/edit/${expense.id}`}><button>✏️</button></Link>
                                        <button onClick={() => handleDeleteExpense(expense.id)}>🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {expenses.length === 0 && <p>Nenhuma despesa da matriz lançada.</p>}
                </div>
            )}
        </div>
    );
};

export default AdminExpensesPage;