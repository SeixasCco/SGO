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

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>🏗️ Todas as Obras</h1>
        <ProjectFilters onFilter={fetchProjects} />
        <button onClick={() => setIsFormVisible(!isFormVisible)} style={{ padding: '10px 20px', fontSize: '16px' }}>
          {isFormVisible ? 'Cancelar' : '+ Nova Obra'}
        </button>
      </div>

      {isFormVisible && <AddWorkForm onWorkAdded={handleWorkAdded} />}

      {loading ? (
        <p>Carregando obras...</p>
      ) : projects.length === 0 ? (
        <p>Nenhuma obra cadastrada ainda.</p>
      ) : (
        <div>
          {projects.map(project => (
            <Link to={`/project/${project.id}`} key={project.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ border: '1px solid #ccc', margin: '15px 0', padding: '15px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ margin: 0 }}>{project.contractor} - {project.name}</h2>
                    <p style={{ margin: '5px 0' }}>📍 {project.city}/{project.state} | 🔢 CNO: {project.cno}</p>
                  </div>
                  <div>
                    <button onClick={(e) => handleEditClick(project.id, e)}>✏️ Editar</button>
                    <button onClick={(e) => handleDeleteProject(project.id, e)} style={{ marginLeft: '10px' }}>🗑️ Deletar</button>
                  </div>
                </div>
                <hr style={{ margin: '15px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                  <div>
                    <strong>Equipe</strong>
                    <p>{project.teamSize} Pessoas</p>
                  </div>
                  <div>
                    <strong>Contratos</strong>
                    <p>R$ {project.totalContractsValue.toFixed(2)}</p>
                  </div>
                  <div>
                    <strong>Despesas</strong>
                    <p>R$ {project.totalExpensesValue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsListPage;