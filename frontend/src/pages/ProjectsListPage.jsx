import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

import AddWorkForm from '../components/AddWorkForm';
import ProjectCard from '../components/common/ProjectCard'; 
import ProjectFilters from '../components/ProjectFilters';

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
            })
            .catch(() => {
                setError("Não foi possível carregar as obras.");
                toast.error("Erro ao carregar obras.");
            })
            .finally(() => setLoading(false));
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
            const promise = axios.delete(`http://localhost:5145/api/projects/${projectId}`);
            toast.promise(promise, {
                loading: 'Deletando obra...',
                success: () => {
                    fetchProjects();
                    return 'Obra deletada com sucesso!';
                },
                error: 'Falha ao deletar a obra.'
            });
        }
    };

    const handleEditClick = (projectId, e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/project/edit/${projectId}`);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-content">
                    <div>
                        <h1 className="page-title">🏗️ Gestão de Obras</h1>
                        <p className="page-subtitle">{projects.length} obra{projects.length !== 1 ? 's' : ''} encontrada{projects.length !== 1 ? 's' : ''}</p>
                    </div>
                    <button onClick={() => setIsFormVisible(!isFormVisible)} className={`form-button ${isFormVisible ? 'danger' : ''}`}>
                        {isFormVisible ? '❌ Cancelar' : '➕ Nova Obra'}
                    </button>
                </div>
            </div>

            <div className="page-content">
                 { <ProjectFilters onFilter={fetchProjects} /> }
                {isFormVisible && (
                    <div className="card" style={{marginBottom: '32px'}}>
                        <AddWorkForm onWorkAdded={handleWorkAdded} />
                    </div>
                )}

                {loading && <div className="loading-state">Carregando obras...</div>}
                {error && <div className="error-state"><h3>{error}</h3></div>}
                
                {!loading && !error && (
                    projects.length === 0 ? (
                        <div className="empty-state card">
                            <div className="empty-state-icon">🏗️</div>
                            <h3>Nenhuma obra cadastrada</h3>
                            <p>Clique em "Nova Obra" para começar.</p>
                        </div>
                    ) : (
                        <div className="project-list-container">
                            {projects.map(project => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onEdit={handleEditClick}
                                    onDelete={handleDeleteProject}
                                />
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default ProjectsListPage;