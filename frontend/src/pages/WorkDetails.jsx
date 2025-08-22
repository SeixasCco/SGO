import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AddExpenseForm from '../components/AddExpenseForm';
import ContractsManager from '../components/ContractsManager';
import TeamManager from '../components/TeamManager';

const WorkDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleDeleteExpense = (expenseId) => {
        if (window.confirm("Tem certeza que deseja deletar esta despesa?")) {
            axios.delete(`http://localhost:5145/api/projectexpenses/${expenseId}`)
                .then(() => {
                    alert("Despesa deletada com sucesso!");
                    fetchProjectDetails();
                })
                .catch(error => {
                    console.error("Erro ao deletar despesa:", error);
                    alert("Falha ao deletar a despesa.");
                });
        }
    };


    const fetchProjectDetails = useCallback(() => {
        setLoading(true);
        axios.get(`http://localhost:5145/api/projects/${id}`)
            .then(response => {
                setProject(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao buscar detalhes da obra!", error);
                setError("Não foi possível carregar os dados da obra.");
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        fetchProjectDetails();
    }, [fetchProjectDetails]);

    if (loading) return <p>Carregando detalhes da obra...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!project) return <p>Obra não encontrada.</p>;

    const defaultContractId = project.contracts && project.contracts.length > 0 ? project.contracts[0].id : null;

    return (
        <div>
            <Link to="/">&larr; Voltar para a lista de obras</Link>
            <h1>Detalhes: {project.contractor} - {project.name}</h1>
            <p><strong>CNO:</strong> {project.cno}</p>
            <ContractsManager
                projectId={project.id}
                onContractAdded={fetchProjectDetails} 
            />
            <TeamManager projectId={project.id} />
            <hr />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Despesas</h2>
                <button onClick={() => setIsFormVisible(!isFormVisible)}>
                    {isFormVisible ? 'Cancelar' : '+ Nova Despesa'}
                </button>
            </div>

            {isFormVisible && (
                defaultContractId ? (
                    <AddExpenseForm
                        projectId={project.id}
                        contractId={defaultContractId}
                        onExpenseAdded={fetchProjectDetails}
                    />
                ) : (
                    <p style={{ color: 'orange' }}>Cadastre um contrato para esta obra antes de lançar despesas.</p>
                )
            )}

            {project.expenses && project.expenses.length > 0 ? (
                <table border="1" style={{ width: '100%', marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Descrição</th>
                            <th>Centro de Custo</th>
                            <th>Nº Pessoas</th>
                            <th>Valor</th>
                            <th>Anexo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {project.expenses.map(expense => (
                            <tr key={expense.id}>
                                <td>{new Date(expense.date).toLocaleDateString()}</td>
                                <td>{expense.description}</td>
                                <td>{expense.numberOfPeople}</td>
                                <td>{expense.costCenterName}</td>
                                <td>R$ {expense.amount.toFixed(2)}</td>
                                <td>
                                    {expense.attachmentPath && (
                                        <a
                                            href={`http://localhost:5145${expense.attachmentPath}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            📎 Ver Anexo
                                        </a>
                                    )}
                                </td>
                                <td>
                                    <Link to={`/expense/edit/${expense.id}`}>
                                        <button>✏️ Editar</button>
                                    </Link>
                                    <button onClick={() => handleDeleteExpense(expense.id)} style={{ marginLeft: '10px' }}>
                                        🗑️ Deletar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Nenhuma despesa lançada para esta obra ainda.</p>
            )}
        </div>
    );
};

export default WorkDetails;