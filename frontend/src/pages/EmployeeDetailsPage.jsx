import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const EmployeeDetailsPage = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5145/api/employees/${id}`)
      .then(response => {
        setEmployee(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Não foi possível carregar os dados do funcionário.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Carregando dados do funcionário...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!employee) return <p>Funcionário não encontrado.</p>;

  return (
    <div>
      <Link to="/employees">&larr; Voltar para a lista de funcionários</Link>
      <h1>Detalhes: {employee.name}</h1>
      <p><strong>Cargo:</strong> {employee.position}</p>
      <p><strong>Data de Contratação:</strong> {new Date(employee.hireDate).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {employee.isActive ? 'Ativo' : 'Inativo'}</p>     
    </div>
  );
};

export default EmployeeDetailsPage;