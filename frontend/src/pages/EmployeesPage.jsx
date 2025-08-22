// Local: frontend/src/pages/EmployeesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ 
      name: '', 
      position: '', 
      salary: '', 
      startDate: new Date().toISOString().split('T')[0],
      endDate: '' 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployees = () => {
    setLoading(true);
    axios.get('http://localhost:5145/api/employees')
      .then(response => {
        setEmployees(response.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Falha ao carregar funcionários.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const employeeDto = {
        ...formData,
        salary: parseFloat(formData.salary),
        endDate: formData.endDate || null
    };
    axios.post('http://localhost:5145/api/employees', employeeDto)
      .then(() => {
        alert('Funcionário cadastrado com sucesso!');
        setFormData({ name: '', position: '', salary: '', startDate: new Date().toISOString().split('T')[0], endDate: '' });
        fetchEmployees();
      })
      .catch(err => {
        alert('Erro ao cadastrar funcionário.');
      });
  };

  const handleDelete = (employeeId) => {
    if (window.confirm("Tem certeza que deseja deletar este funcionário?")) {
      axios.delete(`http://localhost:5145/api/employees/${employeeId}`)
        .then(() => {
          alert("Funcionário deletado com sucesso!");
          fetchEmployees();
        })
        .catch(error => alert("Falha ao deletar o funcionário."));
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>👥 Gestão de Funcionários</h1>
      <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
        <h3>Cadastrar Novo Funcionário</h3>
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
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
        </div>
        <button type="submit">Salvar Funcionário</button>
      </form>

      <h2>Funcionários Cadastrados</h2>
      <table border="1" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Cargo</th>
            <th>Salário</th>
            <th>Data Início</th>
            <th>Data Fim</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.position}</td>
              <td>R$ {emp.salary.toFixed(2)}</td>
              <td>{new Date(emp.startDate).toLocaleDateString()}</td>
              <td>{emp.endDate ? new Date(emp.endDate).toLocaleDateString() : '-'}</td>
              <td>
                <Link to={`/employee/edit/${emp.id}`}>
                  <button>✏️ Editar</button>
                </Link>
                <button onClick={() => handleDelete(emp.id)} style={{ marginLeft: '10px' }}>
                  🗑️ Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeesPage;