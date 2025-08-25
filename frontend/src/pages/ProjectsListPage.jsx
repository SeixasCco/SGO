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
        if (window.confirm("Tem certeza que deseja deletar esta obra e todos os seus dados?")) {
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
    
    const getStatusBadgeJsx = (status, statusText) => {
        const statusStyles = {
            1: { bg: '#fef3c7', color: '#92400e', border: '#f59e0b' },
            2: { bg: '#d1fae5', color: '#065f46', border: '#10b981' },
            3: { bg: '#fed7aa', color: '#9a3412', border: '#f97316' },
            4: { bg: '#dbeafe', color: '#1e40af', border: '#3b82f6' },
            5: { bg: '#e5e7eb', color: '#374151', border: '#6b7280' },
            6: { bg: '#fecaca', color: '#991b1b', border: '#ef4444' }
        };
        const style = statusStyles[status] || statusStyles[2];
        return (
            <span style={{
                padding: '4px 10px',
                borderRadius: '12px',
                backgroundColor: style.bg,
                color: style.color,
                fontSize: '0.7rem',
                fontWeight: '700',
                textTransform: 'uppercase'
            }}>{statusText.replace('?', '').trim()}</span>
        );
    };

    if (error) return ( <div>{error}</div> );

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', padding: '0' }}>
            
            {/* Header da Página */}
            <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '32px 48px', marginBottom: '32px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>
                            🏗️ Gestão de Obras
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: '#64748b', margin: 0, fontWeight: '500' }}>
                            {projects.length} obra{projects.length !== 1 ? 's' : ''} encontrada{projects.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button onClick={() => setIsFormVisible(!isFormVisible)} style={{ /* ...estilos do botão Nova Obra... */ }}>
                        {isFormVisible ? '❌ Cancelar' : '➕ Nova Obra'}
                    </button>
                </div>
            </div>

            {/* Container Principal */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <ProjectFilters onFilter={fetchProjects} />
                </div>

                {isFormVisible && (
                    <div style={{ marginBottom: '32px', backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
                        <AddWorkForm onWorkAdded={handleWorkAdded} />
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '120px 0' }}>Carregando obras...</div>
                ) : projects.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '120px 0' }}>Nenhuma obra cadastrada</div>
                ) : (                    
                    <div>
                        {projects.map(project => {                           
                            const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
                           
                            const cardStyle = {
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                                gap: '20px',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                padding: '20px 24px',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                transition: 'all 0.2s ease-in-out',
                                marginBottom: '16px'
                            };

                            const metricBlockStyle = { textAlign: 'center', padding: '8px', borderRadius: '8px' };
                            const metricLabelStyle = { fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 };
                            const metricValueStyle = { fontSize: '1.1rem', fontWeight: '700' };

                            return (
                                <div key={project.id} style={cardStyle}>
                                    {/* COLUNA 1: INFORMAÇÕES DA OBRA (CLICÁVEL) */}
                                    <Link to={`/project/${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                                {getStatusBadgeJsx(project.status, project.statusText)}
                                                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>{project.contractor} - {project.name}</h2>
                                            </div>
                                            <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem', color: '#64748b' }}>
                                                <span>📍 {project.city}/{project.state}</span>
                                                <span>#️⃣ CNO: {project.cno}</span>
                                                <span>👤 Resp: {project.responsible}</span>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* COLUNA 2: EQUIPE */}
                                    <div style={{ ...metricBlockStyle, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                        <div style={{ ...metricLabelStyle, color: '#15803d' }}>👥 Equipe</div>
                                        <div style={{ ...metricValueStyle, color: '#166534' }}>{project.teamSize}</div>
                                    </div>

                                    {/* COLUNA 3: CONTRATOS */}
                                    <div style={{ ...metricBlockStyle, backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
                                        <div style={{ ...metricLabelStyle, color: '#1d4ed8' }}>📄 Contratos</div>
                                        <div style={{ ...metricValueStyle, color: '#1e40af' }}>{formatCurrency(project.totalContractsValue)}</div>
                                    </div>

                                    {/* COLUNA 4: DESPESAS */}
                                    <div style={{ ...metricBlockStyle, backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
                                        <div style={{ ...metricLabelStyle, color: '#b45309' }}>💰 Despesas</div>
                                        <div style={{ ...metricValueStyle, color: '#92400e' }}>{formatCurrency(project.totalExpensesValue)}</div>
                                    </div>

                                    {/* COLUNA 5: AÇÕES */}
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <button onClick={(e) => handleEditClick(project.id, e)} style={{ padding: '8px 16px', border: '1px solid #d1d5db', backgroundColor: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Editar</button>
                                        <button onClick={(e) => handleDeleteProject(project.id, e)} style={{ padding: '8px 16px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Deletar</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>                    
                )}
            </div>
        </div>
    );
};

export default ProjectsListPage;