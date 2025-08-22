import React, { useState } from 'react';
import axios from 'axios';

const AddExpenseForm = ({ projectId, contractId, onExpenseAdded }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    costCenterName: '',
    numberOfPeople: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    let attachmentPath = null;

    if (selectedFile) {
      const uploadData = new FormData();
      uploadData.append('file', selectedFile);

      try {
        const uploadResponse = await axios.post('http://localhost:5145/api/attachments/upload', uploadData);
        attachmentPath = uploadResponse.data.filePath;
      } catch (err) {
        console.error("Erro no upload do arquivo:", err);
        setError('Falha ao enviar o anexo. Tente novamente.');
        setSubmitting(false);
        return;
      }
    }

    const newExpense = {
      ...formData,
      amount: parseFloat(formData.amount),
      numberOfPeople: formData.numberOfPeople ? parseInt(formData.numberOfPeople, 10) : null,
      projectId: projectId,
      contractId: contractId,
      attachmentPath: attachmentPath,
    };

    try {
      await axios.post('http://localhost:5145/api/projectexpenses', newExpense);
      alert('Despesa lançada com sucesso!');
      setFormData({ description: '', amount: '', date: new Date().toISOString().split('T')[0], costCenterName: '' });
      setSelectedFile(null);
      document.querySelector('input[type="file"]').value = '';
      onExpenseAdded();
    } catch (err) {
      console.error("Erro ao lançar despesa:", err);
      setError('Falha ao lançar despesa. Verifique os dados.');
    } finally {
      setSubmitting(false);
    }
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
        <input type="number" step="0.01" name="amount" min="0" value={formData.amount} onChange={handleChange} required />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Data: </label>
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Centro de Custo: </label>
        <input type="text" name="costCenterName" value={formData.costCenterName} onChange={handleChange} required />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Nº de Pessoas (Opcional): </label>
        <input type="number" name="numberOfPeople" value={formData.numberOfPeople} min="0" onChange={handleChange} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Anexo (NF): </label>
        <input type="file" onChange={handleFileChange} />
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Salvando...' : 'Salvar Despesa'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default AddExpenseForm;