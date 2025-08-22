
import React, { useState } from 'react';

const ProjectFilters = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    city: '',
    serviceTaker: '',
    startDate: '',
    endDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterClick = () => {
    onFilter(filters);
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
      <input type="text" name="city" placeholder="Filtrar por Cidade..." value={filters.city} onChange={handleChange} />
      <input type="text" name="serviceTaker" placeholder="Filtrar por Tomador..." value={filters.serviceTaker} onChange={handleChange} />
      <label>Início:</label>
      <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} />
      <label>Fim:</label>
      <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} />
      <button onClick={handleFilterClick}>Filtrar</button>
    </div>
  );
};

export default ProjectFilters;