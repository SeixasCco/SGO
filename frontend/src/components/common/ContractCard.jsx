import React from 'react';
import { Link } from 'react-router-dom';

const ContractCard = ({ contract, onDelete, formatCurrency }) => (
    <div className="contract-card">
        <div className="contract-card-content" style={{ gridTemplateColumns: 'auto 1fr auto', alignItems: 'center' }}>
            <div className="contract-card-icon">📄</div>
            
            <div className="contract-card-info">
                <h3 className="contract-card-title" style={{ fontSize: '1.1rem', marginBottom: '8px' }}>
                    {contract.title} - <span style={{ color: '#059669', fontWeight: '700' }}>{formatCurrency(contract.totalValue)}</span>
                </h3>
                <p className="contract-card-period" style={{ margin: 0 }}>
                    <strong>Início:</strong> {new Date(contract.startDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} | 
                    <strong> Fim:</strong> {contract.endDate ? new Date(contract.endDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Em andamento'}
                </p>
            </div>
            
            <div className="contract-card-actions">
                <Link to={`/contract/edit/${contract.id}`}>
                    <button className="form-button-secondary">
                        ✏️ Editar
                    </button>
                </Link>
                <button 
                    className="form-button form-button-danger"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(contract.id);
                    }}
                >
                    🗑️ Deletar
                </button>
            </div>
        </div>
    </div>
);

export default ContractCard;