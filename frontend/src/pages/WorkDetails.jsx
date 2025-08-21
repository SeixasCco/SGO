import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AddExpenseForm from '../components/AddExpenseForm';

const WorkDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const fetchProjectDetails = useCallback(() => {
    setLoading(true);
    axios.get(`http://localhost:5145/api/projects/${id}`)
      .then(response => {
        setProject(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar detalhes da obra!", error);
        setError("Não foi possível carregar os dados da obra.");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  if (loading) return <p>Carregando detalhes da obra...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!project) return <p>Obra não encontrada.</p>;

  const defaultContractId = project.contracts && project.contracts.length > 0 ? project.contracts[0].id : null;

  return (
    <div>
      <Link to="/">&larr; Voltar para a lista de obras</Link>
      <h1>Detalhes: {project.contractor} - {project.name}</h1>
      <p><strong>CNO:</strong> {project.cno}</p>

      <hr />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Despesas</h2>
        <button onClick={() => setIsFormVisible(!isFormVisible)}>
          {isFormVisible ? 'Cancelar' : '+ Nova Despesa'}
        </button>
      </div>

      {isFormVisible && (
        defaultContractId ? (
          <AddExpenseForm 
            projectId={project.id} 
            contractId={defaultContractId}
            onExpenseAdded={fetchProjectDetails}
          />
        ) : (
          <p style={{color: 'orange'}}>Cadastre um contrato para esta obra antes de lançar despesas.</p>
        )
      )}

      {/* Adicionei uma verificação para garantir que project.expenses existe antes do map */}
      {project.expenses && project.expenses.length > 0 ? (
        <table border="1" style={{ width: '100%', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {project.expenses.map(expense => (
              <tr key={expense.id}>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>{expense.description}</td>                   
                <td>{expense.costCenterName}</td>
                <td>R$ {expense.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhuma despesa lançada para esta obra ainda.</p>
      )}
    </div>
  );
};

export default WorkDetails;