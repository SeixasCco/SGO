import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const EditEmployeePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5145/api/employees/${id}`)
      .then(response => {
        const employee = response.data;
        setFormData({
          name: employee.name || '',
          position: employee.position || '',
          salary: employee.salary || '',
          startDate: employee.startDate ? employee.startDate.split('T')[0] : '',
          endDate: employee.endDate ? employee.endDate.split('T')[0] : '',
          isActive: employee.isActive !== undefined ? employee.isActive : true
        });
        setLoading(false);
      })
      .catch(err => {
        setError('Não foi possível carregar os dados do funcionário.');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const employeeDto = {
      ...formData,
      salary: parseFloat(formData.salary),
      endDate: formData.endDate || null
    };

    axios.put(`http://localhost:5145/api/employees/${id}`, employeeDto)
      .then(() => {
        alert('Funcionário atualizado com sucesso!');
        navigate('/employees');
      })
      .catch(err => {
        setError('Falha ao atualizar o funcionário. Tente novamente.');
        setSubmitting(false);
      });
  };

  if (loading) {
    return (
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
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
          <div style={{ fontSize: '1.1rem' }}>Carregando dados para edição...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
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

  if (!formData) {
    return (
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
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
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🔍</div>
          <div style={{ fontSize: '1.1rem' }}>Funcionário não encontrado.</div>
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

      {/*  BREADCRUMB/NAVEGAÇÃO */}
      <div style={{
        marginBottom: '32px'
      }}>
        <Link
          to="/employees"
          style={{
            textDecoration: 'none',
            color: '#3b82f6',
            fontSize: '1rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.color = '#2563eb'}
          onMouseLeave={(e) => e.target.style.color = '#3b82f6'}
        >
          ← Voltar para Funcionários
        </Link>

        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          ✏️ Editando Funcionário
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#64748b',
          margin: '0'
        }}>
          Atualize as informações de <strong>{formData.name}</strong>
        </p>
      </div>

      {/*  FORMULÁRIO DE EDIÇÃO MODERNIZADO */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '32px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>

        {/* Avatar e Info do Funcionário */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '32px',
          padding: '24px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #f1f5f9'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#e0e7ff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            border: '3px solid #c7d2fe'
          }}>
            👤
          </div>
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              margin: '0 0 8px 0'
            }}>
              {formData.name}
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#6366f1',
              fontWeight: '500',
              margin: '0 0 4px 0'
            }}>
              {formData.position}
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              borderRadius: '20px',
              backgroundColor: formData.isActive ? '#dcfce7' : '#fef3c7',
              border: `1px solid ${formData.isActive ? '#bbf7d0' : '#fbbf24'}`
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: formData.isActive ? '#10b981' : '#f59e0b'
              }}></div>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: formData.isActive ? '#166534' : '#92400e'
              }}>
                {formData.isActive ? 'ATIVO' : 'INATIVO'}
              </span>
            </div>
          </div>
        </div>

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
                  backgroundColor: '#dcdedfff',
                  color: '#1f2937',
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
                  backgroundColor: '#dcdedfff',
                  color: '#1f2937',
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
                  backgroundColor: '#dcdedfff',
                  color: '#1f2937',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
                  backgroundColor: '#dcdedfff',
                  color: '#1f2937',
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
                value={formData.endDate || ''}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: '#dcdedfff',
                  color: '#1f2937',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
          </div>

          {/* Checkbox Status Ativo */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #f1f5f9',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '32px'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '1rem',
              fontWeight: '500',
              color: '#374151',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: '#3b82f6'
                }}
              />
              <span>Funcionário Ativo</span>
              <span style={{
                fontSize: '0.875rem',
                color: '#64748b',
                fontWeight: '400'
              }}>
                (Desmarque se o funcionário não está mais na empresa)
              </span>
            </label>
          </div>

          {/* Botões de Ação */}
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center'
          }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                backgroundColor: submitting ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 32px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!submitting) e.target.style.backgroundColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                if (!submitting) e.target.style.backgroundColor = '#3b82f6';
              }}
            >
              {submitting ? '⏳ Salvando...' : '💾 Salvar Alterações'}
            </button>

            <Link
              to="/employees"
              style={{
                textDecoration: 'none'
              }}
            >
              <button
                type="button"
                style={{
                  backgroundColor: 'transparent',
                  color: '#64748b',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8fafc';
                  e.target.style.borderColor = '#9ca3af';
                  e.target.style.color = '#374151';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.color = '#64748b';
                }}
              >
                Cancelar
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeePage;
