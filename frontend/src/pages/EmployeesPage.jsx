import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCompany } from '../context/CompanyContext';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const { selectedCompany } = useCompany();
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingForm, setSubmittingForm] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    startDate: new Date().toISOString().split('T')[0],
    salary: '',
    isActive: true
  });

  const [filters, setFilters] = useState({
    name: '',
    position: '',
    salaryMin: '',
    salaryMax: '',
    startDate: '',
    EndDate: '',
    status: 'all'
  });

  const fetchEmployees = useCallback(() => {    
    if (!selectedCompany) {
      setLoading(false);
      return;
    }
    setLoading(true);    
    axios.get(`http://localhost:5145/api/employees`, { params: { companyId: selectedCompany.id } })
      .then(response => {
        setEmployees(response.data || []);
        setFilteredEmployees(response.data || []);
      })
      .catch(error => {
        setError("Erro ao carregar funcionários.");       
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedCompany]);

  useEffect(() => {
    let filtered = employees;

    if (filters.name) {
      filtered = filtered.filter(emp =>
        emp.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.position) {
      filtered = filtered.filter(emp =>
        emp.position.toLowerCase().includes(filters.position.toLowerCase())
      );
    }

    if (filters.salaryMin) {
      filtered = filtered.filter(emp =>
        emp.salary >= parseFloat(filters.salaryMin)
      );
    }

    if (filters.salaryMax) {
      filtered = filtered.filter(emp =>
        emp.salary <= parseFloat(filters.salaryMax)
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter(emp =>
        new Date(emp.startDate) >= new Date(filters.startDate)
      );
    }

    if (filters.EndDate) {
      filtered = filtered.filter(emp =>
        new Date(emp.startDate) <= new Date(filters.EndDate)
      );
    }

    if (filters.status === 'active') {
      filtered = filtered.filter(emp => emp.isActive);
    } else if (filters.status === 'inactive') {
      filtered = filtered.filter(emp => !emp.isActive);
    }

    setFilteredEmployees(filtered);
  }, [employees, filters]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      position: '',
      salaryMin: '',
      salaryMax: '',
      startDate: '',
      EndDate: '',
      status: 'all'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittingForm(true);

    const employeeDto = {
      ...formData,
      salary: parseFloat(formData.salary),
      companyId: selectedCompany.id 
    };

    axios.post('http://localhost:5145/api/employees', employeeDto)
      .then(() => {
        alert('Funcionário cadastrado com sucesso!');
        setFormData({
          name: '',
          position: '',
          startDate: new Date().toISOString().split('T')[0],
          salary: '',
          isActive: true
        });
        fetchEmployees();
      })
      .catch(err => {
        alert('Falha ao cadastrar funcionário.');
        console.error(err);
      })
      .finally(() => {
        setSubmittingForm(false);
      });
  };

  const handleDeleteEmployee = (id) => {
    if (window.confirm('Tem certeza que deseja deletar este funcionário?')) {
      axios.delete(`http://localhost:5145/api/employees/${id}`)
        .then(() => {
          toast.success('Funcionário deletado com sucesso!');
          setEmployees(prev => prev.filter(emp => emp.id !== id));
        })
        .catch(error => {
          const errorMessage = error.response?.data || 'Erro ao deletar funcionário.';          
          toast.error(errorMessage);
        });
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (isActive) => {
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.875rem',
        fontWeight: '600',
        backgroundColor: isActive ? '#dcfce7' : '#fef3c7',
        color: isActive ? '#166534' : '#92400e',
        border: `1px solid ${isActive ? '#bbf7d0' : '#fbbf24'}`
      }}>
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: isActive ? '#10b981' : '#f59e0b'
        }}></div>
        {isActive ? 'ATIVO' : 'INATIVO'}
      </div>
    );
  };

  if (loading) return <div>Carregando funcionários...</div>;
  if (error) return <div style={{ color: '#ef4444' }}>{error}</div>;

  if (!selectedCompany) {
    return (
        <div className="card empty-state">
            <div className="empty-state-icon">🏢</div>
            <h3>Nenhuma Empresa Selecionada</h3>
            <p>Por favor, selecione uma empresa na barra de navegação ou cadastre uma nova em "Gestão de Empresas".</p>
        </div>
    );
  }

  return (
    <div>
      {/* FORMULÁRIO DE CADASTRO */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '32px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        marginBottom: '32px'
      }}>

        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#1e293b',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          Cadastrar Novo Funcionário
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
          }}>

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
                  backgroundColor: '#dcdedfff',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box',
                  color: '#000000',
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                placeholder="Ex: João da Silva"
              />
            </div>

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
                  backgroundColor: '#dcdedfff',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box',
                  color: '#000000',
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                placeholder="Ex: Engenheiro Civil"
              />
            </div>

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
                  backgroundColor: '#dcdedfff',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box',
                  color: '#000000',
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                placeholder="5000.00"
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Data de Contratação
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
                  backgroundColor: '#dcdedfff',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box',
                  color: '#000000',
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submittingForm}
            style={{
              backgroundColor: submittingForm ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 32px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: submittingForm ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = submittingForm ? '#9ca3af' : '#2563eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = submittingForm ? '#9ca3af' : '#3b82f6'}
          >
            {submittingForm ? 'Salvando...' : 'Salvar Funcionário'}
          </button>
        </form>
      </div>

      {/* LISTA DE FUNCIONÁRIOS */}
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
            Funcionários Cadastrados
            <span style={{
              backgroundColor: '#e0e7ff',
              color: '#3730a3',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: '700'
            }}>
              {filteredEmployees.length}
            </span>
          </h2>
        </div>

        {/* Seção de Filtros */}
        <div style={{
          padding: '24px 32px',
          backgroundColor: '#fafbfc',
          borderBottom: '1px solid #f1f5f9'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            alignItems: 'end'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Nome
              </label>
              <input
                type="text"
                placeholder="Filtrar por nome..."
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Cargo
              </label>
              <input
                type="text"
                placeholder="Filtrar por cargo..."
                value={filters.position}
                onChange={(e) => handleFilterChange('position', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Salário Mín.
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={filters.salaryMin}
                onChange={(e) => handleFilterChange('salaryMin', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Salário Máx.
              </label>
              <input
                type="number"
                placeholder="999999.99"
                value={filters.salaryMax}
                onChange={(e) => handleFilterChange('salaryMax', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Contratação De
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Contratação Até
              </label>
              <input
                type="date"
                value={filters.EndDate}
                onChange={(e) => handleFilterChange('EndDate', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box'
                }}
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
              </select>
            </div>

            <div>
              <button
                onClick={clearFilters}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#6b7280'}
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Funcionários */}
        <div style={{ padding: '32px' }}>
          {filteredEmployees.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px',
              color: '#64748b'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👤</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>
                {employees.length === 0 ? 'Nenhum funcionário cadastrado' : 'Nenhum funcionário encontrado'}
              </h3>
              <p style={{ margin: '0' }}>
                {employees.length === 0
                  ? 'Comece cadastrando o primeiro funcionário.'
                  : 'Tente ajustar os filtros para encontrar os funcionários desejados.'
                }
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {filteredEmployees.map(emp => (
                <div key={emp.id} style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '24px',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#fafafa',
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr 1fr 1fr auto',
                  alignItems: 'center',
                  gap: '16px'
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
                  {/* Avatar e Nome */}
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
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: '#166534'
                    }}>
                      {formatCurrency(emp.salary)}
                    </div>
                  </div>

                  {/* Data de Início */}
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

                  {/* Status */}
                  <div style={{ textAlign: 'center' }}>
                    {getStatusBadge(emp.isActive)}
                  </div>

                  {/* Ações */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/employee/edit/${emp.id}`}>
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
                        Editar
                      </button>
                    </Link>

                    <button
                      onClick={() => handleDeleteEmployee(emp.id)}
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
                      Deletar
                    </button>
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
