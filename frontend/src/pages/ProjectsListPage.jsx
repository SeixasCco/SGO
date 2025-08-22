import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddWorkForm from '../components/AddWorkForm';
import ProjectFilters from '../components/ProjectFilters';
import { Link, useNavigate } from 'react-router-dom';

const ProjectsListPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const fetchProjects = (filters = {}) => {
    setLoading(true);
    axios.get('http://localhost:5145/api/projects', { params: filters })
      .then(response => {
        setProjects(response.data || []);
        setLoading(false);
      })
      .catch(error => {
        setError("Não foi possível carregar as obras.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleWorkAdded = () => {
    setIsFormVisible(false);
    fetchProjects();
  };

  const handleDeleteProject = (projectId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Tem certeza que deseja deletar esta obra?")) {
      axios.delete(`http://localhost:5145/api/projects/${projectId}`)
        .then(() => fetchProjects())
        .catch(err => alert("Falha ao deletar a obra."));
    }
  };

  const handleEditClick = (projectId, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/project/edit/${projectId}`);
  };

  const getStatusBadge = (status, statusText) => {
    const statusStyles = {
      1: { bg: '#fef3c7', color: '#92400e', border: '#f59e0b' }, // Planejamento
      2: { bg: '#d1fae5', color: '#065f46', border: '#10b981' }, // Ativa  
      3: { bg: '#fed7aa', color: '#9a3412', border: '#f97316' }, // Pausada
      4: { bg: '#dbeafe', color: '#1e40af', border: '#3b82f6' }, // Concluída
      5: { bg: '#e5e7eb', color: '#374151', border: '#6b7280' }, // Aditivo
      6: { bg: '#fecaca', color: '#991b1b', border: '#ef4444' }  // Cancelada
    };

    const style = statusStyles[status] || statusStyles[2];
    
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '8px 16px',
        fontSize: '0.875rem',
        fontWeight: '600',
        borderRadius: '25px',
        backgroundColor: style.bg,
        color: style.color,
        border: `2px solid ${style.border}`,
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {statusText}
      </span>
    );
  };

  if (error) return (
    <div style={{ 
      padding: '60px', 
      textAlign: 'center',
      backgroundColor: '#fef2f2',
      borderRadius: '12px',
      margin: '40px',
      border: '1px solid #fecaca',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
      <p style={{ color: '#dc2626', fontSize: '1.25rem', margin: 0, fontWeight: '600' }}>{error}</p>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f1f5f9',
      padding: '0'
    }}>
      
      {/* ✅ HEADER FULL-WIDTH DESKTOP */}
      <div style={{ 
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '32px 48px',
        marginBottom: '32px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '3rem',
              fontWeight: '800',
              color: '#0f172a',
              margin: '0 0 8px 0',
              lineHeight: '1.1',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              🏗️ Gestão de Obras
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <p style={{ 
                fontSize: '1.25rem',
                color: '#64748b',
                margin: 0,
                fontWeight: '500'
              }}>
                {projects.length} obra{projects.length !== 1 ? 's' : ''} encontrada{projects.length !== 1 ? 's' : ''}
              </p>
              
              {/* ✅ ESTATÍSTICAS RÁPIDAS NO HEADER */}
              <div style={{ display: 'flex', gap: '32px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>
                    {projects.filter(p => p.status === 2).length}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>
                    ATIVAS
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3b82f6' }}>
                    {projects.filter(p => p.status === 4).length}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>
                    CONCLUÍDAS
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#8b5cf6' }}>
                    R$ {projects.reduce((sum, p) => sum + p.totalContractsValue, 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>
                    TOTAL CONTRATOS
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* ✅ BOTÃO NOVA OBRA GRANDE */}
          <button 
            onClick={() => setIsFormVisible(!isFormVisible)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 32px',
              backgroundColor: isFormVisible ? '#ef4444' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              minWidth: '180px',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px -5px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
          >
            {isFormVisible ? (
              <>❌ Cancelar</>
            ) : (
              <>➕ Nova Obra</>
            )}
          </button>
        </div>
      </div>

      {/* ✅ CONTAINER PRINCIPAL DESKTOP */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto',
        padding: '0 48px'
      }}>
        
        {/* ✅ FILTROS SEMPRE VISÍVEIS PARA DESKTOP */}
        <div style={{ marginBottom: '32px' }}>
          <ProjectFilters onFilter={fetchProjects} />
        </div>

        {/* ✅ FORMULÁRIO COM LARGURA COMPLETA */}
        {isFormVisible && (
          <div style={{ 
            marginBottom: '32px',
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <AddWorkForm onWorkAdded={handleWorkAdded} />
          </div>
        )}

        {/* ✅ LOADING STATE DESKTOP */}
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '120px 0',
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '24px' }}>⏳</div>
            <p style={{ fontSize: '1.5rem', color: '#64748b', margin: 0 }}>
              Carregando obras...
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '120px 0',
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '2px dashed #cbd5e1'
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '24px' }}>🏗️</div>
            <h3 style={{ fontSize: '2rem', color: '#334155', margin: '0 0 12px 0' }}>
              Nenhuma obra cadastrada
            </h3>
            <p style={{ fontSize: '1.25rem', color: '#64748b', margin: 0 }}>
              Clique em "Nova Obra" para começar
            </p>
          </div>
        ) : (
          
          /* ✅ GRID OTIMIZADO PARA DESKTOP - 2 COLUNAS LARGAS */
          <div style={{ 
            display: 'grid',
            gap: '24px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))'
          }}>
            {projects.map(project => (
              <Link 
                to={`/project/${project.id}`} 
                key={project.id} 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{ 
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '32px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  minHeight: '280px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.borderColor = '#3b82f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}>

                  {/* ✅ HEADER DO CARD EXPANDIDO */}
                  <div style={{ marginBottom: '24px' }}>
                    
                    {/* Status e Ações */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                      {getStatusBadge(project.status, project.statusText)}
                      
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button 
                          onClick={(e) => handleEditClick(project.id, e)}
                          style={{
                            padding: '10px 16px',
                            backgroundColor: '#f8fafc',
                            color: '#475569',
                            border: '1px solid #cbd5e1',
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#3b82f6';
                            e.target.style.color = 'white';
                            e.target.style.borderColor = '#3b82f6';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#f8fafc';
                            e.target.style.color = '#475569';
                            e.target.style.borderColor = '#cbd5e1';
                          }}
                        >
                          ✏️ Editar
                        </button>
                        
                        <button 
                          onClick={(e) => handleDeleteProject(project.id, e)}
                          style={{
                            padding: '10px 16px',
                            backgroundColor: '#fef2f2',
                            color: '#dc2626',
                            border: '1px solid #fecaca',
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#dc2626';
                            e.target.style.color = 'white';
                            e.target.style.borderColor = '#dc2626';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#fef2f2';
                            e.target.style.color = '#dc2626';
                            e.target.style.borderColor = '#fecaca';
                          }}
                        >
                          🗑️ Deletar
                        </button>
                      </div>
                    </div>

                    {/* Nome da Obra MAIOR */}
                    <h2 style={{ 
                      fontSize: '1.75rem',
                      fontWeight: '700',
                      color: '#0f172a',
                      margin: '0 0 16px 0',
                      lineHeight: '1.3'
                    }}>
                      {project.contractor} - {project.name}
                    </h2>
                    
                    {/* ✅ INFORMAÇÕES EM GRID PARA DESKTOP */}
                    <div style={{ 
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                      marginBottom: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.1rem' }}>📍</span>
                        <span style={{ fontSize: '1rem', color: '#475569', fontWeight: '500' }}>
                          {project.city}/{project.state}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.1rem' }}>🔢</span>
                        <span style={{ fontSize: '1rem', color: '#475569', fontWeight: '500' }}>
                          CNO: {project.cno}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.1rem' }}>👤</span>
                      <span style={{ fontSize: '1rem', color: '#475569', fontWeight: '500' }}>
                        Responsável: {project.responsible}
                      </span>
                    </div>
                  </div>

                  {/* ✅ MÉTRICAS MAIORES PARA DESKTOP */}
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '20px',
                    paddingTop: '24px',
                    borderTop: '1px solid #f1f5f9'
                  }}>
                    
                    {/* Equipe */}
                    <div style={{ 
                      textAlign: 'center',
                      padding: '20px 16px',
                      backgroundColor: '#f0fdf4',
                      borderRadius: '12px',
                      border: '1px solid #bbf7d0'
                    }}>
                      <div style={{ 
                        fontSize: '2rem',
                        marginBottom: '8px'
                      }}>
                        👥
                      </div>
                      <div style={{ 
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#166534',
                        marginBottom: '4px'
                      }}>
                        {project.teamSize}
                      </div>
                      <div style={{ 
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: '#15803d',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        EQUIPE
                      </div>
                    </div>
                    
                    {/* Contratos */}
                    <div style={{ 
                      textAlign: 'center',
                      padding: '20px 16px',
                      backgroundColor: '#eff6ff',
                      borderRadius: '12px',
                      border: '1px solid #bfdbfe'
                    }}>
                      <div style={{ 
                        fontSize: '2rem',
                        marginBottom: '8px'
                      }}>
                        📄
                      </div>
                      <div style={{ 
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        color: '#1d4ed8',
                        marginBottom: '4px'
                      }}>
                        R$ {project.totalContractsValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div style={{ 
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: '#2563eb',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        CONTRATOS
                      </div>
                    </div>
                    
                    {/* Despesas */}
                    <div style={{ 
                      textAlign: 'center',
                      padding: '20px 16px',
                      backgroundColor: '#fffbeb',
                      borderRadius: '12px',
                      border: '1px solid #fed7aa'
                    }}>
                      <div style={{ 
                        fontSize: '2rem',
                        marginBottom: '8px'
                      }}>
                        💰
                      </div>
                      <div style={{ 
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        color: '#c2410c',
                        marginBottom: '4px'
                      }}>
                        R$ {project.totalExpensesValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div style={{ 
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: '#ea580c',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        DESPESAS
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsListPage;