import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ContractsManager = ({ projectId, onContractAdded }) => {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchContracts = () => {
        axios.get(`http://localhost:5145/api/contracts/byproject/${projectId}`)
            .then(response => {
                setContracts(response.data.$values || response.data || []);
                setLoading(false);
            })
            .catch(error => console.error("Erro ao buscar contratos:", error));
    };

    useEffect(() => {
        fetchContracts();
    }, [projectId]);

    const handleDelete = (contractId) => {
        if (window.confirm("Tem certeza que deseja deletar este contrato?")) {
            axios.delete(`http://localhost:5145/api/contracts/${contractId}`)
                .then(() => {                    
                    toast.success("Contrato deletado com sucesso!");
                    fetchContracts();
                })
                .catch(error => toast.error("Erro ao deletar contrato."));
        }
    };

    const handleAdd = () => {
        const contractNumber = prompt("Digite o número do novo contrato:");
        if (!contractNumber) return;

        const newContract = {
            projectId: projectId,
            contractNumber: contractNumber,
            title: "Novo Contrato",
            totalValue: 0
        };

        axios.post('http://localhost:5145/api/contracts', newContract)
            .then(() => {              
                toast.success("Contrato adicionado com sucesso!");  
                onContractAdded();                
            })
            .catch(error => {            
            const errorMessage = error.response && error.response.data 
                ? error.response.data 
                : "Erro ao adicionar contrato. Verifique os dados e a conexão.";
            
            toast(errorMessage);           
        });
    };


    if (loading) return <p>Carregando contratos...</p>;

    return (
        <div style={{ border: '1px solid #007bff', padding: '15px', marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>📄 Contratos da Obra</h3>
                <button onClick={handleAdd}>+ Adicionar Contrato</button>
            </div>
            <table border="1" style={{ width: '100%', marginTop: '10px' }}>
                <thead>
                    <tr>
                        <th>Número do Contrato</th>
                        <th>Valor Total</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {contracts.length > 0 ? (
                        contracts.map(contract => (
                            <tr key={contract.id}>
                                <td>{contract.contractNumber}</td>
                                <td>R$ {contract.totalValue.toFixed(2)}</td>
                                <td>
                                    <Link to={`/contract/edit/${contract.id}`}>
                                        <button>✏️ Editar</button>
                                    </Link>
                                    <button onClick={() => handleDelete(contract.id)} style={{ marginLeft: '10px' }}>
                                        🗑️ Deletar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">Nenhum contrato cadastrado para esta obra.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ContractsManager;