import React, { useState } from 'react';

import FormGroup from './common/FormGroup';
import StyledInput from './common/StyledInput';

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
        const emptyFilters = { city: '', serviceTaker: '', status: '', startDate: '', endDate: '' };
        setFilters(emptyFilters);
        onFilter({}); 
    };

    const activeFilterCount = Object.values(filters).filter(v => v !== '').length;
    const hasActiveFilters = activeFilterCount > 0;

    return (
        <div className="card">
            <div className="section-header">
                <h2 className="section-title">
                    🔍 Filtros de Pesquisa
                    {hasActiveFilters && (
                        <span className="count-badge">{activeFilterCount} ativo{activeFilterCount > 1 ? 's' : ''}</span>
                    )}
                </h2>
                {hasActiveFilters && (
                    <button onClick={handleClearFilters} className="form-button-secondary danger">
                        🗑️ Limpar Filtros
                    </button>
                )}
            </div>

            <div className="section-body">
                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr 180px 180px' }}>
                    <FormGroup label="🏙️ Cidade">
                        <StyledInput type="text" name="city" placeholder="Ex: São Paulo..." value={filters.city} onChange={handleChange} />
                    </FormGroup>

                    <FormGroup label="🏢 Tomador do Serviço">
                        <StyledInput type="text" name="serviceTaker" placeholder="Ex: Empresa ABC..." value={filters.serviceTaker} onChange={handleChange} />
                    </FormGroup>

                    <FormGroup label="📊 Status da Obra">
                        <select name="status" value={filters.status} onChange={handleChange} className="form-select">
                            <option value="">Todos</option>
                            <option value="1">Planejamento</option>
                            <option value="2">Ativa</option>
                            <option value="3">Pausada</option>
                            <option value="4">Concluída</option>
                            <option value="5">Aditivo</option>
                            <option value="6">Cancelada</option>
                        </select>
                    </FormGroup>

                    <FormGroup label="📅 Data Início">
                        <StyledInput type="date" name="startDate" value={filters.startDate} onChange={handleChange} />
                    </FormGroup>

                    <FormGroup label="🏁 Data Fim">
                        <StyledInput type="date" name="endDate" value={filters.endDate} onChange={handleChange} />
                    </FormGroup>
                </div>

                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <button onClick={handleFilterClick} className="form-button">
                        🔍 Aplicar Filtros
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectFilters;