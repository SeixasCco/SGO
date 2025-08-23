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
      console.log('Alocações carregadas:', teamAllocationsRes.data); 
    }).catch(error => {
      console.error('Erro ao buscar dados:', error);
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
        setSelectedEmployee('');
      })
      .catch(error => {
        alert('Erro ao alocar funcionário.');
        console.error(error);
      });
  };

  const handleEndAllocation = (allocationId) => {
    if (window.confirm("Tem certeza que deseja dar baixa nesta alocação do funcionário?")) {
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

  const handleDeleteAllocation = (allocationId) => {
    if (window.confirm("ATENÇÃO: Esta ação irá excluir permanentemente o registro desta alocação e não irá gerar custos. Use apenas para corrigir erros. Deseja continuar?")) {
      axios.delete(`http://localhost:5145/api/projects/${projectId}/team/${allocationId}`)
        .then(() => {
          alert('Alocação excluída com sucesso!');
          fetchAllData();
        })
        .catch(err => {
          alert('Falha ao excluir a alocação.');
          console.error(err);
        });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('pt-BR');
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
        <div style={{
          textAlign: 'center',
          padding: '20px',
          color: '#666',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px'
        }}>
          Nenhuma alocação encontrada para esta obra.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {allocations.map((alloc) => {
            const isActive = !alloc.endDate;
            
            return (
              <div 
                key={alloc.allocationId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: isActive ? '#f0fff0' : '#f8f9fa', // ✅ Verde claro para ativos
                  border: `1px solid ${isActive ? '#28a745' : '#dee2e6'}`,
                  borderRadius: '8px',
                  gap: '16px'
                }}
              >
                {/* ✅ AVATAR DO FUNCIONÁRIO */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#6c757d',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}>
                  👤
                </div>

                {/* ✅ NOME DO FUNCIONÁRIO */}
                <div style={{ 
                  minWidth: '120px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  {alloc.employeeName}
                </div>

                {/* ✅ SEÇÃO DE DATAS - LAYOUT COMO A IMAGEM */}
                <div style={{ 
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  {/* Data de Início */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '12px',
                      color: '#6c757d',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      marginBottom: '4px'
                    }}>
                      INÍCIO
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#333',
                      fontWeight: '500'
                    }}>
                      {formatDate(alloc.startDate)}
                    </div>
                  </div>

                  {/* Data de Fim OU Status Ativo */}
                  <div style={{ textAlign: 'center' }}>
                    {isActive ? (
                      <>
                        <div style={{
                          fontSize: '12px',
                          color: '#28a745',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          marginBottom: '4px'
                        }}>
                          STATUS
                        </div>
                        <div style={{
                          fontSize: '12px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          ATIVO
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{
                          fontSize: '12px',
                          color: '#6c757d',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          marginBottom: '4px'
                        }}>
                          SAÍDA
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: '#333',
                          fontWeight: '500'
                        }}>
                          {formatDate(alloc.endDate)}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* ✅ BOTÕES DE AÇÃO */}
                <div style={{ 
                  display: 'flex', 
                  gap: '8px',
                  alignItems: 'center'
                }}>
                  {/* ✅ BOTÃO "DAR BAIXA" - Só para alocações ativas */}
                  {isActive && (
                    <button
                      onClick={() => handleEndAllocation(alloc.allocationId)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#ffc107',
                        color: '#212529',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#e0a800'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#ffc107'}
                    >
                      Dar Baixa
                    </button>
                  )}

                  {/* ✅ BOTÃO "EXCLUIR" - Aparece sempre */}
                  <button
                    onClick={() => handleDeleteAllocation(alloc.allocationId)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                  >
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