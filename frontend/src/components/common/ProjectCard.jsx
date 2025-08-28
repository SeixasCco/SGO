import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const ProjectCard = ({ project, onEdit, onDelete }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/project/${project.id}`);
    };
    
    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

    return (
        <div className="project-card" onClick={handleCardClick}>
            <div className="project-card-info">
                <div>
                    <div className="project-card-header">
                        <StatusBadge status={project.status} />
                        <h2 className="project-card-title">{project.contractor} - {project.name}</h2>
                    </div>
                    <div className="project-card-meta">
                        <span>📍 {project.city}/{project.state}</span>
                        <span>#️⃣ CNO: {project.cno}</span>
                        <span>👤 Resp: {project.responsible}</span>
                    </div>
                </div>
            </div>
            <div className="project-card-metrics">
                <div className="metric-block">
                    <span className="metric-label">👥 Equipe</span>
                    <span className="metric-value">{project.teamSize}</span>
                </div>
                <div className="metric-block">
                    <span className="metric-label">📄 Contratos</span>
                    <span className="metric-value">{formatCurrency(project.totalContractsValue)}</span>
                </div>
                <div className="metric-block">
                    <span className="metric-label">💰 Despesas</span>
                    <span className="metric-value">{formatCurrency(project.totalExpensesValue)}</span>
                </div>
            </div>
            <div className="project-card-actions">
                <button onClick={(e) => onEdit(project.id, e)} className="action-button-edit">Editar</button>               
            </div>
        </div>
    );
};

export default ProjectCard;