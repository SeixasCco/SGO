import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeamManager = ({ projectId }) => {
  const [allEmployees, setAllEmployees] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  const fetchAllData = () => {  
    Promise.all([
      axios.get('http://localhost:5145/api/employees/available'), 
      axios.get(`http://localhost:5145/api/projects/${projectId}/team`)
    ]).then(([availableEmployeesRes, teamMembersRes]) => {      
      setAllEmployees(availableEmployeesRes.data || []);
      setTeamMembers(teamMembersRes.data || []);
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
    axios.post(`http://localhost:5145/api/projects/${projectId}/team/${selectedEmployee}`)
      .then(() => fetchAllData());
  };

  const handleRemoveMember = (employeeId) => {
    axios.delete(`http://localhost:5145/api/projects/${projectId}/team/${employeeId}`)
      .then(() => fetchAllData());
  };

  const availableEmployees = allEmployees.filter(emp => 
    !teamMembers.some(member => member.employeeId === emp.id)
  );

  return (
    <div style={{ border: '1px solid #ffc107', padding: '15px', marginTop: '20px' }}>
      <h3>👥 Equipe da Obra</h3>
      <div>
        <select onChange={(e) => setSelectedEmployee(e.target.value)} value={selectedEmployee}>
          <option value="">Selecione um funcionário...</option>
          {availableEmployees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
        <button onClick={handleAddMember} style={{marginLeft: '10px'}}>Adicionar à Equipe</button>
      </div>
      <ul style={{marginTop: '15px'}}>
        {teamMembers.map(member => (
          <li key={member.employeeId} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
            {member.employeeName}
            <button onClick={() => handleRemoveMember(member.employeeId)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamManager;