import React, { useState } from 'react';
import FormGroup from './common/FormGroup';
import StyledInput from './common/StyledInput';

const ProjectFilters = ({ onFilter }) => {
    const [filters, setFilters] = useState({
        contractor: '',
        cnpj: '',
        serviceTaker: '',
        cno: '',
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
        const emptyFilters = { contractor: '', cnpj: '', serviceTaker: '', cno: '', status: '', startDate: '', endDate: '' };
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
                <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    
                    {/* Linha 1 */}
                    <FormGroup label="✍️ Contratante">
                        <StyledInput type="text" name="contractor" placeholder="Nome do contratante..." value={filters.contractor} onChange={handleChange} />
                    </FormGroup>

                    <FormGroup label="📄 CNPJ">
                        <StyledInput type="text" name="cnpj" placeholder="Digite o CNPJ..." value={filters.cnpj} onChange={handleChange} />
                    </FormGroup>

                    <FormGroup label="🏢 Tomador do Serviço">
                        <StyledInput type="text" name="serviceTaker" placeholder="Nome do tomador..." value={filters.serviceTaker} onChange={handleChange} />
                    </FormGroup>

                    {/* Linha 2 */}
                    <FormGroup label="🏗️ CNO da Obra">
                        <StyledInput type="text" name="cno" placeholder="Digite o CNO..." value={filters.cno} onChange={handleChange} />
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
                    
                    <div></div> 

                    {/* Linha 3 - Datas */}
                    <FormGroup label="📅 Período Inicial">
                        <StyledInput type="date" name="startDate" value={filters.startDate} onChange={handleChange} />
                    </FormGroup>

                    <FormGroup label="🏁 Período Final">
                        <StyledInput type="date" name="endDate" value={filters.endDate} onChange={handleChange} />
                    </FormGroup>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                    <button onClick={handleFilterClick} className="form-button">
                        🔍 Aplicar Filtros
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectFilters;