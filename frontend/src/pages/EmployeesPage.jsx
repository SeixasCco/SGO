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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div style={{
        padding: '48px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#64748b'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
          <div style={{ fontSize: '1.1rem' }}>Carregando funcionários...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '48px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          color: '#b91c1c'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>❌</div>
          <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '48px'
    }}>
      
      {/* ✅ HEADER DA PÁGINA */}
      <div style={{
        marginBottom: '32px'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          👥 Gestão de Funcionários
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#64748b',
          margin: '0'
        }}>
          Gerencie sua equipe de colaboradores
        </p>
      </div>

      {/* ✅ FORMULÁRIO DE CADASTRO MODERNIZADO */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '32px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        marginBottom: '32px'
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#1e293b',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          ➕ Cadastrar Novo Funcionário
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Grid responsivo para campos */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
          }}>
            
            {/* Campo Nome */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Nome Completo
              </label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                placeholder="Digite o nome completo"
              />
            </div>

            {/* Campo Cargo */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Cargo/Função
              </label>
              <input 
                type="text" 
                name="position" 
                value={formData.position} 
                onChange={handleChange} 
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                placeholder="Ex: Engenheiro Civil"
              />
            </div>

            {/* Campo Salário */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Salário (R$)
              </label>
              <input 
                type="number" 
                step="0.01" 
                min="0" 
                name="salary" 
                value={formData.salary} 
                onChange={handleChange} 
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                placeholder="5000.00"
              />
            </div>

            {/* Campo Data Início */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Data de Início
              </label>
              <input 
                type="date" 
                name="startDate" 
                value={formData.startDate} 
                onChange={handleChange} 
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            {/* Campo Data Fim */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Data Fim (Opcional)
              </label>
              <input 
                type="date" 
                name="endDate" 
                value={formData.endDate} 
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
          </div>

          {/* Botão de Submissão */}
          <button 
            type="submit"
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 32px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            💾 Salvar Funcionário
          </button>
        </form>
      </div>

      {/* ✅ LISTA DE FUNCIONÁRIOS MODERNIZADA */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        
        {/* Header da Lista */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid #f1f5f9',
          backgroundColor: '#f8fafc'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1e293b',
            margin: '0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            📋 Funcionários Cadastrados
            <span style={{
              backgroundColor: '#e0e7ff',
              color: '#3730a3',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: '700'
            }}>
              {employees.length}
            </span>
          </h2>
        </div>

        {/* Lista de Funcionários */}
        <div style={{ padding: '32px' }}>
          {employees.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px',
              color: '#64748b'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👤</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Nenhum funcionário cadastrado</h3>
              <p style={{ margin: '0' }}>Comece adicionando o primeiro funcionário da sua equipe.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '16px'
            }}>
              {employees.map(emp => (
                <div key={emp.id} style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '24px',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#fafafa'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#c7d2fe';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fafafa';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  
                  {/* Layout responsivo do card do funcionário */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    gap: '20px',
                    alignItems: 'center'
                  }}>
                    
                    {/* Avatar e Info Principal */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        backgroundColor: '#e0e7ff',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        border: '2px solid #c7d2fe'
                      }}>
                        👤
                      </div>
                      
                      <div>
                        <h3 style={{
                          fontSize: '1.2rem',
                          fontWeight: '600',
                          color: '#1e293b',
                          margin: '0 0 4px 0'
                        }}>
                          {emp.name}
                        </h3>
                        <p style={{
                          fontSize: '1rem',
                          color: '#6366f1',
                          fontWeight: '500',
                          margin: '0'
                        }}>
                          {emp.position}
                        </p>
                      </div>
                    </div>

                    {/* Informações Detalhadas */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: '16px'
                    }}>
                      
                      {/* Salário */}
                      <div style={{
                        textAlign: 'center',
                        padding: '12px',
                        backgroundColor: '#f0fdf4',
                        borderRadius: '8px',
                        border: '1px solid #bbf7d0'
                      }}>
                        <div style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: '#15803d',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '4px'
                        }}>
                          SALÁRIO
                        </div>
                        <div style={{
                          fontSize: '1rem',
                          fontWeight: '700',
                          color: '#166534'
                        }}>
                          {formatCurrency(emp.salary)}
                        </div>
                      </div>

                      {/* Data Início */}
                      <div style={{
                        textAlign: 'center',
                        padding: '12px',
                        backgroundColor: '#eff6ff',
                        borderRadius: '8px',
                        border: '1px solid #bfdbfe'
                      }}>
                        <div style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: '#1d4ed8',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '4px'
                        }}>
                          INÍCIO
                        </div>
                        <div style={{
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          color: '#1e40af'
                        }}>
                          {new Date(emp.startDate).toLocaleDateString('pt-BR')}
                        </div>
                      </div>

                      {/* Data Fim */}
                      <div style={{
                        textAlign: 'center',
                        padding: '12px',
                        backgroundColor: emp.endDate ? '#fef3c7' : '#f3f4f6',
                        borderRadius: '8px',
                        border: `1px solid ${emp.endDate ? '#fbbf24' : '#d1d5db'}`
                      }}>
                        <div style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: emp.endDate ? '#92400e' : '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '4px'
                        }}>
                          {emp.endDate ? 'TÉRMINO' : 'STATUS'}
                        </div>
                        <div style={{
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          color: emp.endDate ? '#b45309' : '#10b981'
                        }}>
                          {emp.endDate ? 
                            new Date(emp.endDate).toLocaleDateString('pt-BR') : 
                            'ATIVO'
                          }
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div style={{
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <Link 
                        to={`/employee/edit/${emp.id}`}
                        style={{
                          textDecoration: 'none'
                        }}
                      >
                        <button style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 16px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                        >
                          ✏️ Editar
                        </button>
                      </Link>
                      
                      <button 
                        onClick={() => handleDelete(emp.id)}
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 16px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                      >
                        🗑️ Deletar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;