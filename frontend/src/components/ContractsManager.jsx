import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import ContractCard from './common/ContractCard';

const ContractsManager = ({ projectId, onContractAdded, contracts, loading, fetchContracts }) => {

    const handleDelete = (contractId) => {
        if (window.confirm("Tem certeza que deseja deletar este contrato?")) {
            const promise = axios.delete(`http://localhost:5145/api/contracts/${contractId}`);
            toast.promise(promise, {
                loading: 'Deletando contrato...',
                success: () => {
                    fetchContracts(); 
                    return "Contrato deletado com sucesso!";
                },
                 error: (err) => err.response?.data || "Erro ao deletar contrato. Verifique as dependências."
            });
        }
    };

    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

    return (
        <div className="section-container">
            <div className="section-header">
                <h2 className="section-title">
                    📄 Contratos da Obra
                    <span className="count-badge">{contracts.length}</span>
                </h2>                
            </div>

            <div className="section-body">
                {loading ? (
                    <div className="loading-state">Carregando contratos...</div>
                ) : contracts.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📄</div>
                        <h3 className="empty-state-title">Nenhum contrato cadastrado</h3>
                        <p className="empty-state-description">Clique em "Adicionar Contrato" para começar.</p>
                    </div>
                ) : (
                    <div className="contracts-list">
                        {contracts.map(contract => (
                            <ContractCard
                                key={contract.id}
                                contract={contract}
                                onDelete={handleDelete}
                                formatCurrency={formatCurrency}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContractsManager;