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
        const project = response.data;
        setFormData({
          name: project.name || '',
          contractor: project.contractor || '',
          cno: project.cno || '',
          serviceTaker: project.serviceTaker || '',
          responsible: project.responsible || '',
          city: project.city || '',
          state: project.state || '',
          address: project.address || '',
          description: project.description || '',
          startDate: project.startDate ? project.startDate.split('T')[0] : '',
          endDate: project.endDate ? project.endDate.split('T')[0] : '',
          status: project.status || 2
        });
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
      serviceTaker: formData.serviceTaker,
      responsible: formData.responsible,
      city: formData.city,
      state: formData.state,
      address: formData.address,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate || null,
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
      
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>        
        
        {/* Informações básicas */}
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
          <label>Tomador do Serviço: </label>
          <input type="text" name="serviceTaker" value={formData.serviceTaker} onChange={handleChange} required />
        </div>
        
        {/* CAMPO RESPONSÁVEL QUE ESTAVA FALTANDO */}
        <div style={{ marginBottom: '10px' }}>
          <label>Responsável: </label>
          <input type="text" name="responsible" value={formData.responsible} onChange={handleChange} required />
        </div>
        
        {/* Localização */}
        <div style={{ marginBottom: '10px' }}>
          <label>Cidade: </label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} required />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>Estado: </label>
          <input type="text" name="state" value={formData.state} onChange={handleChange} maxLength="2" required />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>Endereço: </label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} />
        </div>
        
        {/* Datas */}
        <div style={{ marginBottom: '10px' }}>
          <label>Data Início: </label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>Data Fim: </label>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
        </div>
        
        {/* Status */}
        <div style={{ marginBottom: '10px' }}>
          <label>Status da Obra: </label>
          <select name="status" value={formData.status} onChange={handleChange} required>
            <option value={1}>Planejamento</option>
            <option value={2}>Ativa</option>
            <option value={3}>Pausada</option>
            <option value={4}>Concluída</option>
            <option value={5}>Aditivo</option>
            <option value={6}>Cancelada</option>
          </select>
        </div>
        
        {/* Descrição */}
        <div style={{ marginBottom: '10px' }}>
          <label>Descrição: </label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange}
            rows="3"
            style={{ width: '100%' }}
          />
        </div>
        
        <button type="submit" style={{ padding: '10px 20px', fontSize: '16px' }}>
          Salvar Alterações
        </button>
      </form>
    </div>
  );
};

export default EditWorkPage;