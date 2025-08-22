import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const EditContractPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    axios.get(`http://localhost:5145/api/contracts/${id}`)
      .then(response => {
        setFormData(response.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const contractDto = {
      contractNumber: formData.contractNumber,
      title: formData.title,
      totalValue: parseFloat(formData.totalValue)
    };
    axios.put(`http://localhost:5145/api/contracts/${id}`, contractDto)
      .then(() => {
        alert('Contrato atualizado com sucesso!');
        navigate(`/project/${formData.projectId}`);
      })
      .catch(err => alert('Falha ao atualizar o contrato.'));
  };

  if (loading) return <p>Carregando contrato...</p>;
  if (!formData) return <p>Contrato não encontrado.</p>;

  return (
    <div>
      <Link to={`/project/${formData.projectId}`}>&larr; Voltar para a obra</Link>
      <h1>✏️ Editando Contrato</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Número do Contrato: </label>
          <input type="text" name="contractNumber" value={formData.contractNumber} onChange={handleChange} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Título: </label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Valor Total (R$): </label>
          <input type="number" step="0.01" name="totalValue"  min="0" value={formData.totalValue} onChange={handleChange} />
        </div>
        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
};

export default EditContractPage;