import React from 'react';
import { Link } from 'react-router-dom';

const ContractCard = ({ contract, onDelete, formatCurrency }) => (
    <div className="contract-card">
        <div className="contract-card-content">
            <div className="contract-card-main">
                <div className="contract-card-icon">📄</div>
                <div className="contract-card-info">
                    <h3 className="contract-card-title">{contract.contractNumber}</h3>
                    <p className="contract-card-period">
                        {new Date(contract.startDate).toLocaleDateString('pt-BR')} - 
                        {contract.endDate ? new Date(contract.endDate).toLocaleDateString('pt-BR') : 'Em andamento'}
                    </p>
                </div>
            </div>
            
            <div className="contract-card-value">
                <div className="contract-card-value-label">VALOR TOTAL</div>
                <div className="contract-card-value-amount">{formatCurrency(contract.totalValue)}</div>
            </div>
            
            <div className="contract-card-actions">
                <Link to={`/contract/edit/${contract.id}`}>
                    <button className="form-button-secondary">
                        ✏️ Editar
                    </button>
                </Link>
                <button 
                    className="form-button form-button-danger"
                    onClick={() => onDelete(contract.id)}
                >
                    🗑️ Deletar
                </button>
            </div>
        </div>
    </div>
);

export default ContractCard;