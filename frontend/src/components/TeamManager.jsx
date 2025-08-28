import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import FormGroup from './common/FormGroup';
import StyledInput from './common/StyledInput';
import AllocationCard from './common/AllocationCard';

const TeamManager = ({ projectId, allocations, onTeamUpdate }) => {
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const todayString = new Date().toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(todayString);

    useEffect(() => {
        axios.get('http://localhost:5145/api/employees/available')
            .then(res => setAvailableEmployees(res.data || []))
            .catch(() => toast.error('Erro ao buscar funcionários.'));
    }, []);

    const handleAddMember = () => {
        if (!selectedEmployee) {
            return toast.error("Selecione um funcionário.");
        }
        const promise = axios.post(`http://localhost:5145/api/projects/${projectId}/team/${selectedEmployee}`, { startDate });
        toast.promise(promise, {
            loading: 'Alocando funcionário...',
            success: () => {
                onTeamUpdate();
                setSelectedEmployee('');
                return 'Funcionário alocado com sucesso!';
            },
            error: (err) => err.response?.data?.message || 'Erro ao alocar funcionário.'
        });
    };

    const handleEndAllocation = (allocationId) => {
        if (window.confirm("Tem certeza que deseja dar baixa nesta alocação?")) {
            const promise = axios.put(`http://localhost:5145/api/projects/${projectId}/team/${allocationId}/end`);
            toast.promise(promise, {
                loading: 'Dando baixa...',
                success: 'Baixa realizada com sucesso!',
                error: (err) => err.response?.data?.message || 'Falha ao dar baixa.'
            }).then(() => onTeamUpdate());
        }
    };

    const handleDeleteAllocation = (allocationId) => {
        if (window.confirm("ATENÇÃO: Excluir permanentemente o registro de alocação?")) {
            const promise = axios.delete(`http://localhost:5145/api/projects/${projectId}/team/${allocationId}`);
            toast.promise(promise, {
                loading: 'Excluindo...',
                success: 'Alocação excluída!',
                error: (err) => err.response?.data?.message || 'Falha ao excluir.'
            }).then(() => onTeamUpdate());
        }
    };    
   
    const calculateAllocationCost = (allocation) => {
        if (!allocation.salary) return 0;
        const dailyRate = allocation.salary / 30;
        const start = new Date(allocation.startDate);
        const end = allocation.endDate ? new Date(allocation.endDate) : new Date();
        const timeDiff = end.getTime() - start.getTime();
        const dayDiff = Math.max(0, Math.round(timeDiff / (1000 * 60 * 60 * 24)));
        return dailyRate * (dayDiff + 1);
    };
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : '--/--/----';
    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    return (
        <div className="card">
            <h3 className="card-header">👥 Equipe da Obra</h3>
            
            <div className="section-body">
                <div className="form-section">
                    <div className="form-grid" style={{alignItems: 'flex-end'}}>
                        <FormGroup label="Funcionários Disponíveis">
                            <select className="form-select" onChange={(e) => setSelectedEmployee(e.target.value)} value={selectedEmployee}>
                                <option value="">Selecione...</option>
                                {availableEmployees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                                ))}
                            </select>
                        </FormGroup>
                        <FormGroup label="Data de Início">
                            <StyledInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} max={todayString} />
                        </FormGroup>
                        <button onClick={handleAddMember} className="form-button">
                            + Adicionar à Equipe
                        </button>
                    </div>
                </div>

                <h3 className="section-divider">Histórico de Alocações</h3>
                {allocations.length === 0 ? (
                    <div className="empty-state"><p>Nenhuma alocação encontrada...</p></div>
                ) : (
                    <div className="allocations-list">
                        {allocations.map((alloc) => (
                            <AllocationCard 
                                key={alloc.allocationId}
                                allocation={alloc}
                                onEnd={handleEndAllocation}
                                onDelete={handleDeleteAllocation}
                                calculateCost={calculateAllocationCost}
                                formatDate={formatDate}
                                formatCurrency={formatCurrency}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamManager;