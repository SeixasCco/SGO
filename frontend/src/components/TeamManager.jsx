import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeamManager = ({ projectId, allocations, onTeamUpdate }) => {
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchAllData = () => {
    Promise.all([
      axios.get('http://localhost:5145/api/employees/available'),
      axios.get(`http://localhost:5145/api/projects/${projectId}/team`)
    ]).then(([availableEmployeesRes, teamAllocationsRes]) => {
      setAvailableEmployees(availableEmployeesRes.data || []);
      setAllocations(teamAllocationsRes.data || []);
      console.log('Alocações carregadas:', teamAllocationsRes.data);
    }).catch(error => {
      console.error('Erro ao buscar dados:', error);
    });
  };

  useEffect(() => {
    axios.get('http://localhost:5145/api/employees/available')
      .then(res => setAvailableEmployees(res.data || []))
      .catch(error => console.error('Erro ao buscar funcionários disponíveis:', error));
  }, []);

  const handleAddMember = () => {
    if (!selectedEmployee) return alert("Por favor, selecione um funcionário.");

    axios.post(`http://localhost:5145/api/projects/${projectId}/team/${selectedEmployee}`, { startDate: startDate })
      .then(() => {
        alert('Funcionário alocado com sucesso!');
        onTeamUpdate();
        setSelectedEmployee('');
      })
      .catch(error => alert('Erro ao alocar funcionário.'));
  };

  const handleEndAllocation = (allocationId) => {
    if (window.confirm("Tem certeza que deseja dar baixa nesta alocação?")) {
      axios.put(`http://localhost:5145/api/projects/${projectId}/team/${allocationId}/end`)
        .then(() => {
          alert('Baixa realizada com sucesso!');
          onTeamUpdate();
        })
        .catch(err => alert('Falha ao dar baixa na alocação.'));
    }
  };

  const handleDeleteAllocation = (allocationId) => {
    if (window.confirm("ATENÇÃO: Esta ação irá excluir permanentemente o registro de alocação. Use apenas para corrigir erros. Deseja continuar?")) {
      axios.delete(`http://localhost:5145/api/projects/${projectId}/team/${allocationId}`)
        .then(() => {
          alert('Alocação excluída com sucesso!');
          onTeamUpdate();
        })
        .catch(err => alert('Falha ao excluir a alocação.'));
    }
  };

  const calculateAllocationCost = (allocation) => {
    if (!allocation.salary || allocation.salary === 0) {
      return 0;
    }
    const dailyRate = allocation.salary / 30;
    const start = new Date(allocation.startDate);
    const end = allocation.endDate ? new Date(allocation.endDate) : new Date();
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(0, 0, 0, 0);
    const timeDiff = end.getTime() - start.getTime();
    const dayDiff = Math.round(timeDiff / (1000 * 60 * 60 * 24));
    const daysWorked = dayDiff + 1;

    return dailyRate * daysWorked;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '--/--/----';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const statusBadgeStyle = {
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase'
    };

    const activeStatusStyle = {
        ...statusBadgeStyle,
        backgroundColor: '#28a745',
        color: 'white',
    };

    const inactiveStatusStyle = {
        ...statusBadgeStyle,
        backgroundColor: '#e5e7eb',
        color: '#4b5563',
    };

  return (
    <div style={{
      border: '1px solid #ffc107',
      padding: '15px',
      marginTop: '20px',
      borderRadius: '8px'
    }}>
      <h3 style={{ marginBottom: '20px', color: '#333' }}>👥 Equipe da Obra</h3>

      {/* ✅ SEÇÃO DE ADICIONAR FUNCIONÁRIO */}
      <div style={{
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <select
          onChange={(e) => setSelectedEmployee(e.target.value)}
          value={selectedEmployee}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            minWidth: '200px'
          }}
        >
          <option value="">Selecione um funcionário disponível...</option>
          {availableEmployees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        />

        <button
          onClick={handleAddMember}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          + Adicionar à Equipe
        </button>
      </div>

      {/* ✅ CARDS DE ALOCAÇÕES (COMO O LAYOUT ATUAL) */}
      <h4 style={{ marginBottom: '15px', color: '#555' }}>Histórico de Alocações</h4>
            
            {allocations.length === 0 ? (
                <div>Nenhuma alocação encontrada...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {allocations.map((alloc) => {
                        const isActive = !alloc.endDate;
                        const cost = calculateAllocationCost(alloc);

                        return (
                            <div 
                                key={alloc.allocationId}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'minmax(200px, 1.5fr) 2fr 1fr', // Colunas: Nome | Dados | Ações
                                    alignItems: 'center',
                                    padding: '16px',
                                    backgroundColor: isActive ? '#f0fff0' : '#f8f9fa',
                                    border: `1px solid ${isActive ? '#28a745' : '#dee2e6'}`,
                                    borderRadius: '8px',
                                    gap: '16px'
                                }}
                            >
                                {/* COLUNA 1: NOME */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', backgroundColor: '#6c757d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '16px' }}>
                                        👤
                                    </div>
                                    <div style={{ fontWeight: '600', color: '#333' }}>{alloc.employeeName}</div>
                                </div>

                                {/* COLUNA 2: DADOS (INÍCIO, SAÍDA, STATUS, CUSTO) */}
                                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                    {/* Início */}
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '12px', color: '#6c757d', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>INÍCIO</div>
                                        <div style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>{formatDate(alloc.startDate)}</div>
                                    </div>
                                    {/* Saída */}
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '12px', color: '#6c757d', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>SAÍDA</div>
                                        <div style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>{formatDate(alloc.endDate)}</div>
                                    </div>
                                    {/* Status */}
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '12px', color: '#6c757d', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>STATUS</div>
                                        <div><span style={isActive ? activeStatusStyle : inactiveStatusStyle}>{isActive ? 'ATIVO' : 'INATIVO'}</span></div>
                                    </div>
                                    {/* Custo */}
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '12px', color: '#6c757d', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>CUSTO</div>
                                        <div style={{ fontSize: '14px', color: '#c2410c', fontWeight: '700' }}>{formatCurrency(cost)}</div>
                                    </div>
                                </div>

                                {/* COLUNA 3: AÇÕES (BOTÕES) */}
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    {isActive && (
                                        <button onClick={() => handleEndAllocation(alloc.allocationId)} style={{ padding: '8px 16px', backgroundColor: '#ffc107', color: '#212529', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                                            Dar Baixa
                                        </button>
                                    )}
                                    <button onClick={() => handleDeleteAllocation(alloc.allocationId)} style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                                        🗑️ Excluir
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TeamManager;