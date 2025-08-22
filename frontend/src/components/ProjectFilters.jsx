import React, { useState } from 'react';

const ProjectFilters = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    city: '',
    serviceTaker: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterClick = () => {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );
    onFilter(cleanFilters);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      city: '',
      serviceTaker: '',
      status: '',
      startDate: '',
      endDate: ''
    };
    setFilters(emptyFilters);
    onFilter({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>

      {/* ✅ HEADER DOS FILTROS SEMPRE VISÍVEL */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid #f1f5f9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.5rem' }}>🔍</span>
          <span style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#0f172a'
          }}>
            Filtros de Pesquisa
          </span>
          {hasActiveFilters && (
            <span style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: '600',
              padding: '4px 12px',
              borderRadius: '12px'
            }}>
              {Object.values(filters).filter(v => v !== '').length} ativo{Object.values(filters).filter(v => v !== '').length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f8fafc',
              color: '#64748b',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.875rem',
              cursor: 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ef4444';
              e.target.style.color = 'white';
              e.target.style.borderColor = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f8fafc';
              e.target.style.color = '#64748b';
              e.target.style.borderColor = '#cbd5e1';
            }}
          >
            🗑️ Limpar Filtros
          </button>
        )}
      </div>

      {/* ✅ GRID DESKTOP - 5 COLUNAS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 150px 150px',
        gap: '20px',
        marginBottom: '24px'
      }}>

        {/* Filtro Cidade */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
          }}>
            🏙️ Cidade
          </label>
          <input
            type="text"
            name="city"
            placeholder="Ex: São Paulo..."
            value={filters.city}
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
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Filtro Tomador */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
          }}>
            🏢 Tomador do Serviço
          </label>
          <input
            type="text"
            name="serviceTaker"
            placeholder="Ex: Empresa ABC..."
            value={filters.serviceTaker}
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
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Filtro Status */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
          }}>
            📊 Status da Obra
          </label>
          <select
            name="status"
            value={filters.status}
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
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="">Todos</option>
            <option value="1">🟡 Planejamento</option>
            <option value="2">🟢 Ativa</option>
            <option value="3">🟠 Pausada</option>
            <option value="4">✅ Concluída</option>
            <option value="5">🔄 Aditivo</option>
            <option value="6">❌ Cancelada</option>
          </select>
        </div>

        {/* Filtro Data Início */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
          }}>
            📅 Data Início
          </label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
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
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Filtro Data Fim */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
          }}>
            🏁 Data Fim
          </label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            style={{
              padding: '12px 16px',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
              backgroundColor: '#dcdedfff',
              color: '#1f2937',
              fontWeight: '600',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* ✅ BOTÃO APLICAR FILTROS CENTRALIZADO */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handleFilterClick}
          style={{
            padding: '12px 32px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            minWidth: '200px'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#2563eb';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#3b82f6';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          🔍 Aplicar Filtros
        </button>
      </div>
    </div>
  );
};

export default ProjectFilters;