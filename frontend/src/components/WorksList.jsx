// Local: frontend/src/components/WorksList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddWorkForm from './AddWorkForm';
import { Link } from 'react-router-dom'; // Importando o Link

const WorksList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false); 
 
  const fetchProjects = () => {
    setLoading(true);
    axios.get('http://localhost:5145/api/projects')
      .then(response => {        
        const projectsArray = response.data.$values || response.data || [];
        setProjects(response.data || []); 
        setLoading(false);
      })
      .catch(error => {
        console.error("Houve um erro ao buscar as obras!", error);
        setError("Não foi possível carregar os dados das obras.");
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

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>🏗️ Minhas Obras</h1>
        <button onClick={() => setIsFormVisible(!isFormVisible)}>
          {isFormVisible ? 'Cancelar' : '+ Nova Obra'}
        </button>
      </div>

      {isFormVisible && <AddWorkForm onWorkAdded={handleWorkAdded} />}
      
      {loading ? (
        <p>Carregando obras...</p>
      ) : projects.length === 0 ? (
        <p>Nenhuma obra cadastrada ainda.</p>
      ) : (
        projects.map(project => (
          // Adicionando o Link para envolver o card da obra
          <Link to={`/project/${project.id}`} key={project.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #ccc', margin: '10px', padding: '10px', cursor: 'pointer' }}>
              <h2>{project.contractor} - {project.name}</h2>
              <p>📍 {project.city}/{project.state}</p>
              <p>🔢 CNO: {project.cno}</p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default WorksList;