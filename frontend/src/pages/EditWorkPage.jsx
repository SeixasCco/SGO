import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const EditWorkPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5145/api/projects/${id}`)
      .then(response => {
        setFormData(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Não foi possível carregar os dados da obra.');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const projectDto = {
      name: formData.name,
      contractor: formData.contractor,
      cno: formData.cno,
      city: formData.city,
      state: formData.state,
      address: formData.address,
      description: formData.description,
      status: formData.status
    };

     axios.put(`http://localhost:5145/api/projects/${id}`, projectDto)
      .then(() => {
        alert('Obra atualizada com sucesso!');
        navigate('/'); 
      })
      .catch(err => {
        setError('Falha ao atualizar a obra. Tente novamente.');
      });
  };

  if (loading) return <p>Carregando dados para edição...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!formData) return <p>Obra não encontrada.</p>;

  return (
    <div>
      <Link to="/">&larr; Voltar para a lista de obras</Link>
      <h1>✏️ Editando Obra: {formData.name}</h1>
      <form onSubmit={handleSubmit}>        
        <div style={{ marginBottom: '10px' }}>
          <label>Nome da Obra: </label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Contratante: </label>
          <input type="text" name="contractor" value={formData.contractor} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>CNO: </label>
          <input type="text" name="cno" value={formData.cno} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Cidade: </label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Estado: </label>
          <input type="text" name="state" value={formData.state} onChange={handleChange} maxLength="2" required />
        </div>           
        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
};

export default EditWorkPage;