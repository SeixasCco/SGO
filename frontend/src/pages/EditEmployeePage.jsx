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
        employee.hireDate = new Date(employee.hireDate).toISOString().split('T')[0];
        setFormData(employee);
        setLoading(false);
      })
      .catch(err => {
        setError('Não foi possível carregar os dados do funcionário.');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const employeeDto = {
      name: formData.name,
      position: formData.position,
      hireDate: formData.hireDate,
    };

    axios.put(`http://localhost:5145/api/employees/${id}`, employeeDto)
      .then(() => {
        alert('Funcionário atualizado com sucesso!');
        navigate('/employees');
      })
      .catch(err => {
        console.error("Erro ao atualizar funcionário:", err.response.data);
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
          <label>Data de Contratação: </label>
          <input type="date" name="hireDate" value={formData.hireDate} onChange={handleChange} required />
        </div>
        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
};

export default EditEmployeePage;