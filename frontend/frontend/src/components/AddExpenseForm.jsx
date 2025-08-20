import React, { useState } from 'react'; 
import axios from 'axios';

const AddExpenseForm = ({ projectId, contractId, onExpenseAdded }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    costCenterName: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const newExpense = {
      ...formData,
      amount: parseFloat(formData.amount),
      projectId: projectId,
      contractId: contractId,
    };

    axios.post('http://localhost:5145/api/projectexpenses', newExpense)
      .then(response => {
        alert('Despesa lançada com sucesso!');
        setFormData({ description: '', amount: '', date: new Date().toISOString().split('T')[0], costCenterName: '' });
        onExpenseAdded(); 
      })
      .catch(err => {
        console.error("Erro ao lançar despesa:", err);
        setError('Falha ao lançar despesa. Verifique os dados.');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid green', padding: '15px', marginTop: '20px' }}>
      <h3>Lançar Nova Despesa</h3>
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
        <input type="text" name="costCenterName" value={formData.costCenterName} onChange={handleChange} required />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Salvando...' : 'Salvar Despesa'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default AddExpenseForm;