import React from 'react';
import StatusBadge from './StatusBadge';

const AllocationCard = ({ allocation, onEnd, onDelete, calculateCost, formatDate, formatCurrency }) => {
    const isActive = !allocation.endDate;
    const cost = calculateCost(allocation);

    return (
        <div className={`allocation-card ${isActive ? 'active' : 'inactive'}`}>
            <div className="allocation-employee-info">
                <div className="employee-avatar">👤</div>
                <span className="employee-name">{allocation.employeeName}</span>
            </div>

            <div className="allocation-details">
                <div className="detail-item">
                    <span className="detail-label">INÍCIO</span>
                    <span className="detail-value">{formatDate(allocation.startDate)}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">SAÍDA</span>
                    <span className="detail-value">{formatDate(allocation.endDate)}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">CUSTO ATÉ HOJE</span>
                    <span className="detail-value cost">{formatCurrency(cost)}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">STATUS</span>
                    <StatusBadge status={isActive ? 'active' : 'inactive'} textOverride={{active: 'ATIVO', inactive: 'INATIVO'}} />
                </div>
            </div>

            <div className="allocation-actions">
                {isActive && (
                    <button onClick={() => onEnd(allocation.allocationId)} className="form-button-secondary warning">
                        Dar Baixa
                    </button>
                )}
                <button onClick={() => onDelete(allocation.allocationId)} className="action-button-icon danger" title="Excluir Alocação">
                    🗑️
                </button>
            </div>
        </div>
    );
};

export default AllocationCard;