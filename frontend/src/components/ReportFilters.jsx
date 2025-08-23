
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportFilters = ({ filters, onFiltersChange }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {   
    axios.get('http://localhost:5145/api/projects')
      .then(response => {
        setProjects(response.data || []);
      });
  }, []);

  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
      <div>
        <label>Data Início: </label>
        <input 
          type="date" 
          name="startDate" 
          value={filters.startDate} 
          onChange={onFiltersChange} 
        />
      </div>
      <div>
        <label>Data Fim: </label>
        <input 
          type="date" 
          name="endDate" 
          value={filters.endDate} 
          onChange={onFiltersChange} 
        />
      </div>
      <div>
        <label>Obras (segure Ctrl para selecionar): </label>
        <select 
          name="projectIds" 
          multiple 
          value={filters.projectIds} 
          onChange={onFiltersChange} 
          style={{ height: '100px' }}
        >
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ReportFilters;