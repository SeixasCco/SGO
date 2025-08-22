// Local: frontend/src/pages/EditContractPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const EditContractPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [projectInfo, setProjectInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5145/api/contracts/${id}`)
      .then(response => {
        const contract = response.data;
        // Formatear fechas para el input
        setFormData({
          ...contract,
          startDate: contract.startDate ? contract.startDate.split('T')[0] : '',
          endDate: contract.endDate ? contract.endDate.split('T')[0] : ''
        });

        // Buscar informações do projeto
        return axios.get(`http://localhost:5145/api/projects/${contract.projectId}`);
      })
      .then(projectResponse => {
        setProjectInfo(projectResponse.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Não foi possível carregar os dados do contrato.');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const contractDto = {
      contractNumber: formData.contractNumber,
      title: formData.title,
      totalValue: parseFloat(formData.totalValue),
      startDate: formData.startDate,
      endDate: formData.endDate || null,
      observations: formData.observations || ''
    };

    axios.put(`http://localhost:5145/api/contracts/${id}`, contractDto)
      .then(() => {
        alert('Contrato atualizado com sucesso!');
        navigate(`/project/${formData.projectId}`);
      })
      .catch(err => {
        setError('Falha ao atualizar o contrato. Tente novamente.');
        setSubmitting(false);
      });
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
          <div style={{ fontSize: '1.1rem' }}>Carregando dados do contrato...</div>
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
          <div style={{ fontSize: '1.1rem' }}>Contrato não encontrado.</div>
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

      {/* ✅ BREADCRUMB/NAVEGAÇÃO */}
      <div style={{
        marginBottom: '32px'
      }}>
        <Link
          to={`/project/${formData.projectId}`}
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
          ← Voltar para a Obra
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
          ✏️ Editando Contrato
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#64748b',
          margin: '0'
        }}>
          Atualize os dados do contrato <strong>{formData.contractNumber}</strong>
        </p>
      </div>

      {/* ✅ INFORMAÇÕES DA OBRA */}
      {projectInfo && (
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '32px'
        }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#1e40af',
            margin: '0 0 12px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🏗️ Informações da Obra
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div>
              <span style={{ fontSize: '0.875rem', color: '#1d4ed8', fontWeight: '600' }}>Nome:</span>
              <div style={{ fontSize: '1rem', color: '#1e40af', fontWeight: '500' }}>
                {projectInfo.contractor} - {projectInfo.name}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', color: '#1d4ed8', fontWeight: '600' }}>CNO:</span>
              <div style={{ fontSize: '1rem', color: '#1e40af', fontWeight: '500' }}>
                {projectInfo.cno}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', color: '#1d4ed8', fontWeight: '600' }}>Local:</span>
              <div style={{ fontSize: '1rem', color: '#1e40af', fontWeight: '500' }}>
                {projectInfo.city}/{projectInfo.state}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ FORMULÁRIO DE EDIÇÃO MODERNIZADO */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '32px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>

        {/* Header do Contrato */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '32px',
          padding: '24px',
          backgroundColor: '#f0fdf4',
          borderRadius: '12px',
          border: '1px solid #bbf7d0'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            border: '3px solid #bbf7d0'
          }}>
            📄
          </div>
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#166534',
              margin: '0 0 8px 0'
            }}>
              {formData.contractNumber}
            </h2>
            <p style={{
              fontSize: '1rem',
              color: '#15803d',
              margin: '0 0 8px 0',
              fontWeight: '500'
            }}>
              {formData.title}
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              backgroundColor: '#dcfce7',
              borderRadius: '16px',
              border: '1px solid #10b981'
            }}>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#166534' }}>
                💰 {formatCurrency(formData.totalValue)}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Seção: Informações Básicas */}
          <div style={{
            marginBottom: '32px'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              paddingBottom: '8px',
              borderBottom: '2px solid #f1f5f9'
            }}>
              📋 Informações do Contrato
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>

              {/* Número do Contrato */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Número do Contrato
                </label>
                <input
                  type="text"
                  name="contractNumber"
                  value={formData.contractNumber}
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
                  placeholder="Ex: T30/2025"
                />
              </div>

              {/* Título */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Título do Contrato
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
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
                  placeholder="Ex: Construção de Supermercado"
                />
              </div>

              {/* Valor Total */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Valor Total (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="totalValue"
                  min="0"
                  value={formData.totalValue}
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
                  placeholder="0.00"
                />
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  marginTop: '4px'
                }}>
                  Use ponto (.) para separar decimais: 50000.00
                </div>
              </div>
            </div>
          </div>

          {/* Seção: Cronograma */}
          <div style={{
            marginBottom: '32px'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              paddingBottom: '8px',
              borderBottom: '2px solid #f1f5f9'
            }}>
              📅 Cronograma do Contrato
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>

              {/* Data Início */}
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
                  style={{
                    padding: '12px 16px',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: '#dcdedfff',
                    color: '#1f2937',
                    fontWeight: '600'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              {/* Data Fim */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Data de Fim (Opcional)
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  style={{
                    padding: '12px 16px',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: '#dcdedfff',
                    color: '#1f2937',
                    fontWeight: '600'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
            </div>
          </div>

          {/* Seção: Observações */}
          <div style={{
            marginBottom: '32px'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              paddingBottom: '8px',
              borderBottom: '2px solid #f1f5f9'
            }}>
              📝 Observações
            </h3>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Observações do Contrato (Opcional)
              </label>
              <textarea
                name="observations"
                value={formData.observations || ''}
                onChange={handleChange}
                rows="4"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s ease',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                placeholder="Descreva detalhes específicos do contrato, clausulas importantes, prazos especiais..."
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            paddingTop: '24px',
            borderTop: '1px solid #f1f5f9'
          }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                backgroundColor: submitting ? '#9ca3af' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '14px 32px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!submitting) e.target.style.backgroundColor = '#059669';
              }}
              onMouseLeave={(e) => {
                if (!submitting) e.target.style.backgroundColor = '#10b981';
              }}
            >
              {submitting ? '⏳ Salvando...' : '💾 Salvar Alterações'}
            </button>

            <Link
              to={`/project/${formData.projectId}`}
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
                  padding: '14px 24px',
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

export default EditContractPage;