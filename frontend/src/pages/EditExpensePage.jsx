import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const EditExpensePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:5145/api/projectexpenses/${id}`)
            .then(response => {
                const expense = response.data;
                expense.date = new Date(expense.date).toISOString().split('T')[0];
                setFormData(expense);
                setLoading(false);
            })
            .catch(err => {
                setError('Não foi possível carregar os dados da despesa.');
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const expenseToUpdate = { ...formData, costCenter: null };

        const expenseDto = {
            id: formData.id,
            projectId: formData.projectId,
            contractId: formData.contractId,
            costCenterId: formData.costCenterId,
            description: formData.description,
            amount: parseFloat(formData.amount),
            date: formData.date,
            attachmentPath: formData.attachmentPath
        };

        axios.put(`http://localhost:5145/api/projectexpenses/${id}`, expenseDto)
            .then(() => {
                alert('Despesa atualizada com sucesso!');
                navigate(`/project/${formData.projectId}`);
            })
            .catch(err => {
                console.error("Erro ao atualizar despesa:", err);
                setError('Falha ao atualizar a despesa.');
            });
    };

    if (loading) return <p>Carregando dados da despesa...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!formData) return <p>Despesa não encontrada.</p>;

    return (
        <div>
            <Link to={`/project/${formData.projectId}`}>&larr; Voltar para a obra</Link>
            <h1>✏️ Editando Despesa</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Descrição: </label>
                    <input type="text" name="description" value={formData.description} onChange={handleChange} required />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Valor (R$): </label>
                    <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} required />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Data: </label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Centro de Custo: </label>
                    <input type="text" name="costCenterName" value={formData.costCenter?.name} disabled />
                </div>
                <button type="submit">Salvar Alterações</button>
            </form>
        </div>
    );
};

export default EditExpensePage;