import React, { useState } from 'react'; 
import axios from 'axios';

const AddWorkForm = ({ onWorkAdded }) => {
  const [formData, setFormData] = useState({
    cno: '',
    name: '',
    contractor: '',
    city: '',
    state: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const newWork = {
      ...formData,
      status: 2,
    };

    axios.post('http://localhost:5145/api/projects', newWork)
      .then(response => {
        alert('Obra cadastrada com sucesso!');
        setFormData({ cno: '', name: '', contractor: '', city: '', state: '' }); 
        onWorkAdded(); 
      })
      .catch(err => {
        console.error("Erro ao cadastrar obra:", err);
        setError('Falha ao cadastrar obra. Tente novamente.');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid blue', padding: '15px', margin: '15px 0' }}>
      <h3>Cadastrar Nova Obra</h3>
      <div style={{ marginBottom: '10px' }}>
        <label>CNO: </label>
        <input type="text" name="cno" value={formData.cno} onChange={handleChange} required />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Nome da Obra: </label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Contratante: </label>
        <input type="text" name="contractor" value={formData.contractor} onChange={handleChange} required />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Cidade: </label>
        <input type="text" name="city" value={formData.city} onChange={handleChange} required />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Estado: </label>
        <input type="text" name="state" value={formData.state} onChange={handleChange} maxLength="2" required />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Salvando...' : 'Salvar Obra'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default AddWorkForm;