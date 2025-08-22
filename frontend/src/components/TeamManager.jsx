// Em frontend/src/components/TeamManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeamManager = ({ projectId }) => {
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchAllData = () => {
    Promise.all([
      axios.get('http://localhost:5145/api/employees/available'),
      axios.get(`http://localhost:5145/api/projects/${projectId}/team`)
    ]).then(([availableEmployeesRes, teamAllocationsRes]) => {
      setAvailableEmployees(availableEmployeesRes.data || []);
      setAllocations(teamAllocationsRes.data || []);
    });
  };

  useEffect(() => {
    fetchAllData();
  }, [projectId]);

  const handleAddMember = () => {
    if (!selectedEmployee) {
      alert("Por favor, selecione um funcionário.");
      return;
    }
    axios.post(`http://localhost:5145/api/projects/${projectId}/team/${selectedEmployee}`, { startDate: startDate })
      .then(() => {
        alert('Funcionário alocado com sucesso!');
        fetchAllData();
      });
  };

  const handleEndAllocation = (allocationId) => {
    if (window.confirm("Tem certeza que deseja dar baixa nesta alocação do funcionário?")) {
      // Chama o novo endpoint PUT para dar baixa
      axios.put(`http://localhost:5145/api/projects/${projectId}/team/${allocationId}/end`)
        .then(() => {
            alert('Baixa realizada com sucesso!');
            fetchAllData();
        })
        .catch(err => {
            alert('Falha ao dar baixa na alocação.');
            console.error(err);
        });
    }
  };
  
  return (
    <div style={{ border: '1px solid #ffc107', padding: '15px', marginTop: '20px' }}>
      <h3>👥 Equipe da Obra</h3>
      <div style={{ marginBottom: '20px' }}>
        <select onChange={(e) => setSelectedEmployee(e.target.value)} value={selectedEmployee}>
          <option value="">Selecione um funcionário disponível...</option>
          {availableEmployees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
        <input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)}
          style={{marginLeft: '10px'}}
        />
        <button onClick={handleAddMember} style={{marginLeft: '10px'}}>Adicionar à Equipe</button>
      </div>
      
      <h4>Histórico de Alocações</h4>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Funcionário</th>
            <th>Início na Obra</th>
            <th>Fim na Obra</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {allocations.length > 0 ? (
            allocations.map(alloc => (
              <tr key={alloc.allocationId}>
                <td>{alloc.employeeName}</td>
                <td>{new Date(alloc.startDate).toLocaleDateString()}</td>
                <td>{alloc.endDate ? new Date(alloc.endDate).toLocaleDateString() : 'Ativo'}</td>
                <td>                 
                  {!alloc.endDate && (
                    <button onClick={() => handleEndAllocation(alloc.allocationId)}>Dar Baixa</button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{textAlign: 'center'}}>Nenhum funcionário alocado nesta obra.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TeamManager;