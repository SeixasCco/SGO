// Local: frontend/src/pages/EditEmployeePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const EditEmployeePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5145/api/employees/${id}`)
      .then(response => {
        const employee = response.data;
        employee.startDate = new Date(employee.startDate).toISOString().split('T')[0];
        if (employee.endDate) {
            employee.endDate = new Date(employee.endDate).toISOString().split('T')[0];
        }
        setFormData(employee);
        setLoading(false);
      })
      .catch(err => {
        setError('Não foi possível carregar os dados do funcionário.');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const employeeDto = {
        name: formData.name,
        position: formData.position,
        salary: parseFloat(formData.salary),
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        isActive: formData.isActive
    };
    axios.put(`http://localhost:5145/api/employees/${id}`, employeeDto)
      .then(() => {
        alert('Funcionário atualizado com sucesso!');
        navigate('/employees');
      })
      .catch(err => {
        setError('Falha ao atualizar o funcionário. Tente novamente.');
      });
  };

  if (loading) return <p>Carregando dados para edição...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!formData) return <p>Funcionário não encontrado.</p>;

  return (
    <div>
      <Link to="/employees">&larr; Voltar para a lista</Link>
      <h1>✏️ Editando Funcionário: {formData.name}</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Nome: </label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Cargo: </label>
          <input type="text" name="position" value={formData.position} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Salário (R$): </label>
          <input type="number" step="0.01" min="0" name="salary" value={formData.salary} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Data Início: </label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Data Fim (Opcional): </label>
          <input type="date" name="endDate" value={formData.endDate  || ''} onChange={handleChange} />
        </div>
         <div style={{ marginBottom: '10px' }}>
          <label>
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
            Funcionário Ativo
          </label>
        </div>
        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
};

export default EditEmployeePage;