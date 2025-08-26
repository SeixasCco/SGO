import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

import AddContractModal from '../components/AddContractModal';
import TeamManager from '../components/TeamManager';
import AddExpenseModal from '../components/AddExpenseModal';

const WorkDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [showAddContractModal, setShowAddContractModal] = useState(false);
    const [contracts, setContracts] = useState([]);
    const [allocations, setAllocations] = useState([]);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    
    // Estados que estavam faltando:
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [startDate, setStartDate] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [expenseFormData, setExpenseFormData] = useState({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        costCenterId: ''       
    });
    const [isExpenseFormVisible, setIsExpenseFormVisible] = useState(false);
    const [submittingExpense, setSubmittingExpense] = useState(false);
    const [loadingContracts, setLoadingContracts] = useState(false);

    const fetchProjectDetails = useCallback(() => {
        setLoading(true);
        axios.get(`http://localhost:5145/api/projects/${id}`)
            .then(response => {
                setProject(response.data);
            })
            .catch(error => {
                setError(error.response?.data?.message || "Erro ao carregar detalhes da obra.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const fetchContracts = useCallback(() => {
        setLoadingContracts(true);
        axios.get(`http://localhost:5145/api/contracts/byproject/${id}`)
            .then(response => {
                setContracts(response.data || []);
            })
            .catch(error => {
                console.error("Erro ao buscar contratos:", error);
            })
            .finally(() => {
                setLoadingContracts(false);
            });
    }, [id]);

    const fetchTeamData = useCallback(() => {
        axios.get(`http://localhost:5145/api/projects/${id}/team`)
            .then(response => {
                setAllocations(response.data || []);
            })
            .catch(error => {
                console.error("Erro ao buscar dados da equipe:", error);
            });
    }, [id]);

    const handleTeamUpdate = useCallback(() => {
        fetchTeamData();
        fetchProjectDetails();
    }, [fetchTeamData, fetchProjectDetails]);

    useEffect(() => {
        fetchProjectDetails();
        fetchContracts();
        fetchTeamData();
    }, [id, fetchProjectDetails, fetchContracts, fetchTeamData]);

    // Funções que estavam faltando:
    const handleAddContract = () => {
        setShowAddContractModal(true);
    };

    const handleCloseContractModal = () => {
        setShowAddContractModal(false);
    };

    const handleExpenseAdded = () => {
        setIsExpenseFormVisible(false);
        fetchProjectDetails();
    };

    const handleContractAdded = () => {
        setShowAddContractModal(false);
        fetchContracts();
        fetchProjectDetails();
    };

    const handleDeleteContract = (contractId) => {
        if (window.confirm("Tem certeza que deseja deletar este contrato?")) {
            axios.delete(`http://localhost:5145/api/contracts/${contractId}`)
                .then(() => {
                    alert("Contrato deletado com sucesso!");
                    fetchContracts();
                    fetchProjectDetails();
                })
                .catch(error => alert("Erro ao deletar contrato."));
        }
    };

    const handleAddTeamMember = () => {
        if (!selectedEmployee) {
            alert("Por favor, selecione um funcionário.");
            return;
        }
        axios.post(`http://localhost:5145/api/projects/${id}/team/${selectedEmployee}`, { startDate: startDate })
            .then(() => {
                alert('Funcionário alocado com sucesso!');
                fetchTeamData();
                setSelectedEmployee('');
            })
            .catch(error => alert("Erro ao alocar funcionário."));
    };

    const handleEndAllocation = (allocationId) => {
        if (window.confirm("Tem certeza que deseja dar baixa nesta alocação?")) {
            axios.put(`http://localhost:5145/api/projects/${id}/team/${allocationId}/end`)
                .then(() => {
                    alert('Baixa realizada com sucesso!');
                    fetchTeamData();
                })
                .catch(err => {
                    alert('Falha ao dar baixa na alocação.');
                    console.error(err);
                });
        }
    };

    const handleExpenseSubmit = async (e) => {
        e.preventDefault();
        setSubmittingExpense(true);

        const defaultContractId = contracts.length > 0 ? contracts[0].id : null;
        if (!defaultContractId) {
            alert("Cadastre um contrato antes de lançar despesas.");
            setSubmittingExpense(false);
            return;
        }

        let attachmentPath = null;

        if (selectedFile) {
            const uploadData = new FormData();
            uploadData.append('file', selectedFile);

            try {
                const uploadResponse = await axios.post('http://localhost:5145/api/attachments/upload', uploadData);
                attachmentPath = uploadResponse.data.filePath;
            } catch (err) {
                alert('Falha ao enviar o anexo.');
                setSubmittingExpense(false);
                return;
            }
        }

        const newExpense = {
            description: expenseFormData.description,
            amount: parseFloat(expenseFormData.amount),
            date: expenseFormData.date,
            costCenterId: expenseFormData.costCenterId,       
            projectId: id,
            contractId: defaultContractId,
            attachmentPath: attachmentPath,
        };

        try {
            await axios.post('http://localhost:5145/api/projectexpenses', newExpense);
            alert('Despesa lançada com sucesso!');
            setExpenseFormData({
                description: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                costCenterId: ''                
            });
            setSelectedFile(null);
            setIsExpenseFormVisible(false);
            fetchProjectDetails();
        } catch (err) {
            alert('Falha ao lançar despesa.');
        } finally {
            setSubmittingExpense(false);
        }
    };

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

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            1: { text: 'Planejamento', bg: '#fef3c7', color: '#92400e', border: '#f59e0b' },
            2: { text: 'Ativa', bg: '#d1fae5', color: '#065f46', border: '#10b981' },
            3: { text: 'Pausada', bg: '#fed7aa', color: '#9a3412', border: '#f97316' },
            4: { text: 'Concluída', bg: '#dbeafe', color: '#1e40af', border: '#3b82f6' },
            5: { text: 'Aditivo', bg: '#e5e7eb', color: '#374151', border: '#6b7280' },
            6: { text: 'Cancelada', bg: '#fecaca', color: '#991b1b', border: '#ef4444' }
        };
        const style = statusMap[status] || statusMap[2];
        return (
            <span style={{
                backgroundColor: style.bg,
                color: style.color,
                border: `1px solid ${style.border}`,
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: '600'
            }}>
                {style.text}
            </span>
        );
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;
    if (!project) return <div>Projeto não encontrado.</div>;

    return (
        <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '48px'
        }}>
            {/* Renderiza os modais no topo para que fiquem sobre todo o conteúdo */}
            <AddContractModal
                isOpen={showAddContractModal}
                onClose={handleCloseContractModal}
                projectId={id}
                projectName={`${project.contractor} - ${project.name}`}
                onContractAdded={handleContractAdded}
            />
            {isExpenseFormVisible && (
                <AddExpenseModal
                    onClose={() => setIsExpenseFormVisible(false)}
                    onExpenseAdded={handleExpenseAdded}
                    projectId={id}
                    contractId={contracts.length > 0 ? contracts[0].id : null}
                />
            )}

            {/* BREADCRUMB/NAVEGAÇÃO */}
            <div style={{ marginBottom: '32px' }}>
                <Link
                    to="/projects"
                    style={{
                        textDecoration: 'none',
                        color: '#3b82f6',
                        fontSize: '1rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '16px'
                    }}
                >
                    ← Voltar para Lista de Obras
                </Link>
            </div>

            {/* HEADER DA OBRA */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '32px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                marginBottom: '32px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0', lineHeight: '1.2' }}>
                            {project.contractor} - {project.name}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                            {getStatusBadge(project.status)}
                            <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: '500' }}>
                                📍 {project.city}/{project.state}
                            </span>
                        </div>
                    </div>
                    <Link to={`/project/edit/${project.id}`} style={{ textDecoration: 'none' }}>
                        <button style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
                            ✏️ Editar Obra
                        </button>
                    </Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                    <div style={{ padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#1d4ed8', textTransform: 'uppercase', marginBottom: '4px' }}>CNO</div>
                        <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1e40af' }}>{project.cno}</div>
                    </div>
                    <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#15803d', textTransform: 'uppercase', marginBottom: '4px' }}>RESPONSÁVEL</div>
                        <div style={{ fontSize: '1rem', fontWeight: '600', color: '#166534' }}>{project.responsible}</div>
                    </div>
                    <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fbbf24' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#92400e', textTransform: 'uppercase', marginBottom: '4px' }}>PERÍODO</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#b45309' }}>
                            {new Date(project.startDate).toLocaleDateString('pt-BR')} - {project.endDate ? new Date(project.endDate).toLocaleDateString('pt-BR') : 'Em andamento'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navegação por Abas */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0' }}>
                {[
                    { id: 'overview', label: '📊 Visão Geral' },
                    { id: 'contracts', label: '📄 Contratos' },
                    { id: 'team', label: '👥 Equipe' },
                    { id: 'expenses', label: '💰 Despesas' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '12px 20px',
                            border: 'none',
                            backgroundColor: activeTab === tab.id ? '#3b82f6' : 'transparent',
                            color: activeTab === tab.id ? 'white' : '#64748b',
                            borderRadius: '8px 8px 0 0',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* CONTEÚDO DAS TABS */}
            <div style={{ backgroundColor: 'white', borderRadius: '0 0 12px 12px', border: '1px solid #e2e8f0', borderTop: 'none', padding: '32px' }}>
                {/* TAB: VISÃO GERAL COM CARDS COMPACTOS */}
                {activeTab === 'overview' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                        <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569', margin: '0 0 12px 0' }}>📄 Contratos</h3>
                            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#3b82f6', marginBottom: '4px' }}>
                                {formatCurrency(contracts.reduce((sum, contract) => sum + contract.totalValue, 0))}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '500' }}>
                                em {contracts.length} contrato(s) ativo(s)
                            </div>
                        </div>
                        <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569', margin: '0 0 12px 0' }}>👥 Equipe</h3>
                            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>
                                {allocations.filter(alloc => !alloc.endDate).length}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '500' }}>
                                Funcionários Ativos
                            </div>
                        </div>
                        <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569', margin: '0 0 12px 0' }}>💰 Despesas</h3>
                            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#ef4444', marginBottom: '4px' }}>
                                {formatCurrency(project.expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0)}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '500' }}>
                                Total Gasto
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: CONTRATOS */}
                {activeTab === 'contracts' && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden'
                    }}>
                        {/* Header da Seção */}
                        <div style={{
                            padding: '24px 32px',
                            borderBottom: '1px solid #f1f5f9',
                            backgroundColor: '#f8fafc',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h2 style={{
                                fontSize: '1.5rem',
                                fontWeight: '600',
                                color: '#1e293b',
                                margin: '0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                📄 Contratos da Obra
                                <span style={{
                                    backgroundColor: '#e0e7ff',
                                    color: '#3730a3',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.875rem',
                                    fontWeight: '700'
                                }}>
                                    {contracts.length}
                                </span>
                            </h2>

                            <button
                                onClick={handleAddContract}
                                style={{
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '12px 20px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                            >
                                ➕ Adicionar Contrato
                            </button>
                        </div>

                        {/* Lista de Contratos */}
                        <div style={{ padding: '32px' }}>
                            {loadingContracts ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '48px',
                                    color: '#64748b'
                                }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
                                    <div style={{ fontSize: '1.1rem' }}>Carregando contratos...</div>
                                </div>
                            ) : contracts.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '48px',
                                    color: '#64748b'
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📄</div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Nenhum contrato cadastrado</h3>
                                    <p style={{ margin: '0' }}>Comece adicionando o primeiro contrato da obra.</p>
                                </div>
                            ) : (
                                <div style={{
                                    display: 'grid',
                                    gap: '16px'
                                }}>
                                    {contracts.map(contract => (
                                        <div key={contract.id} style={{
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '12px',
                                            padding: '24px',
                                            transition: 'all 0.2s ease',
                                            backgroundColor: '#fafafa'
                                        }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#f8fafc';
                                                e.currentTarget.style.borderColor = '#c7d2fe';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(0, 0, 0, 0.1)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = '#fafafa';
                                                e.currentTarget.style.borderColor = '#e2e8f0';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'auto 1fr auto',
                                                gap: '20px',
                                                alignItems: 'center'
                                            }}>
                                                {/* Ícone e Info Principal */}
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '16px'
                                                }}>
                                                    <div style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        backgroundColor: '#eff6ff',
                                                        borderRadius: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '1.5rem',
                                                        border: '2px solid #bfdbfe'
                                                    }}>
                                                        📄
                                                    </div>

                                                    <div>
                                                        <h3 style={{
                                                            fontSize: '1.1rem',
                                                            fontWeight: '600',
                                                            color: '#1e293b',
                                                            margin: '0 0 4px 0'
                                                        }}>
                                                            {contract.contractNumber}
                                                        </h3>
                                                        <p style={{
                                                            fontSize: '0.9rem',
                                                            color: '#64748b',
                                                            margin: '0'
                                                        }}>
                                                            {new Date(contract.startDate).toLocaleDateString('pt-BR')} - {contract.endDate ? new Date(contract.endDate).toLocaleDateString('pt-BR') : 'Em andamento'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Valor */}
                                                <div style={{
                                                    textAlign: 'center',
                                                    padding: '12px',
                                                    backgroundColor: '#f0fdf4',
                                                    borderRadius: '8px',
                                                    border: '1px solid #bbf7d0'
                                                }}>
                                                    <div style={{
                                                        fontSize: '0.75rem',
                                                        fontWeight: '600',
                                                        color: '#15803d',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px',
                                                        marginBottom: '4px'
                                                    }}>
                                                        VALOR TOTAL
                                                    </div>
                                                    <div style={{
                                                        fontSize: '1.1rem',
                                                        fontWeight: '700',
                                                        color: '#166534'
                                                    }}>
                                                        {formatCurrency(contract.totalValue)}
                                                    </div>
                                                </div>

                                                {/* Ações */}
                                                <div style={{
                                                    display: 'flex',
                                                    gap: '8px'
                                                }}>
                                                    <Link
                                                        to={`/contract/edit/${contract.id}`}
                                                        style={{ textDecoration: 'none' }}
                                                    >
                                                        <button style={{
                                                            backgroundColor: '#3b82f6',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            padding: '8px 16px',
                                                            fontSize: '0.875rem',
                                                            fontWeight: '600',
                                                            cursor: 'pointer',
                                                            transition: 'background-color 0.2s ease',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '6px'
                                                        }}
                                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                                                        >
                                                            ✏️ Editar
                                                        </button>
                                                    </Link>

                                                    <button
                                                        onClick={() => handleDeleteContract(contract.id)}
                                                        style={{
                                                            backgroundColor: '#ef4444',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            padding: '8px 16px',
                                                            fontSize: '0.875rem',
                                                            fontWeight: '600',
                                                            cursor: 'pointer',
                                                            transition: 'background-color 0.2s ease',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '6px'
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                                                    >
                                                        🗑️ Deletar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB: EQUIPE (DELEGADA AO TEAMMANAGER) */}
                {activeTab === 'team' && (
                    <TeamManager
                        projectId={id}
                        allocations={allocations}
                        onTeamUpdate={handleTeamUpdate}
                    />
                )}

                {/* TAB: DESPESAS (USA O NOVO MODAL) */}
                {activeTab === 'expenses' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#1e2d3b' }}>
                                Despesas Lançadas
                            </h2>
                            <button onClick={() => setIsExpenseFormVisible(true)} style={{ backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontWeight: '600' }}>
                                ➕ Nova Despesa
                            </button>
                        </div>
                        <div style={{ marginTop: '24px' }}>
                            {!project.expenses || project.expenses.length === 0 ? (
                                <p>Nenhuma despesa lançada para esta obra.</p>
                            ) : (
                                project.expenses.map(expense => (
                                    <div key={expense.id} style={{ borderBottom: '1px solid #f1f5f9', padding: '16px 0', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#1e2d3b' }}>{expense.description}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(expense.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</div>
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#475569' }}>{expense.costCenterName}</div>
                                        <div style={{ fontWeight: '700', color: '#dc2626' }}>{formatCurrency(expense.amount)}</div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {!expense.isVirtual && (
                                                <>
                                                    <Link to={`/expense/edit/${expense.id}`}><button>✏️</button></Link>
                                                    <button onClick={() => handleDeleteExpense(expense.id)}>🗑️</button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkDetails;