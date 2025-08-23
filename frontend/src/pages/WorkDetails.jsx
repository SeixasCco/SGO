import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AddContractModal from '../components/AddContractModal';
import TeamManager from '../components/TeamManager';

const WorkDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isExpenseFormVisible, setIsExpenseFormVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [showAddContractModal, setShowAddContractModal] = useState(false);

    // Estados para gerenciamento de contratos
    const [contracts, setContracts] = useState([]);
    const [loadingContracts, setLoadingContracts] = useState(false);

    // Estados para gerenciamento de equipe
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [allocations, setAllocations] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    // Estados para formulário de despesas
    const [expenseFormData, setExpenseFormData] = useState({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        costCenterName: '',
        numberOfPeople: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [submittingExpense, setSubmittingExpense] = useState(false);

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

    const fetchContracts = useCallback(() => {
        setLoadingContracts(true);
        axios.get(`http://localhost:5145/api/contracts/byproject/${id}`)
            .then(response => {
                setContracts(response.data || []);
                setLoadingContracts(false);
            })
            .catch(error => {
                console.error("Erro ao buscar contratos:", error);
                setLoadingContracts(false);
            });
    }, [id]);

    const fetchTeamData = useCallback(() => {
        Promise.all([
            axios.get('http://localhost:5145/api/employees/available'),
            axios.get(`http://localhost:5145/api/projects/${id}/team`)
        ]).then(([availableEmployeesRes, teamAllocationsRes]) => {
            setAvailableEmployees(availableEmployeesRes.data || []);
            setAllocations(teamAllocationsRes.data || []);
        }).catch(error => {
            console.error("Erro ao buscar dados da equipe:", error);
        });
    }, [id]);

    useEffect(() => {
        fetchProjectDetails();
        fetchContracts();
        fetchTeamData();
    }, [fetchProjectDetails, fetchContracts, fetchTeamData]);

    // Função para adicionar contrato
    const handleAddContract = () => {
        setShowAddContractModal(true);
    };

    const handleContractAdded = () => {
        fetchContracts();
        fetchProjectDetails();
    };

    const handleCloseContractModal = () => {
        setShowAddContractModal(false);
    };


    // Função para deletar contrato
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

    // Função para adicionar funcionário à equipe
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

    // Função para dar baixa na alocação
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

    // Função para adicionar despesa
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
            ...expenseFormData,
            amount: parseFloat(expenseFormData.amount),
            numberOfPeople: expenseFormData.numberOfPeople ? parseInt(expenseFormData.numberOfPeople, 10) : null,
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
                costCenterName: '',
                numberOfPeople: ''
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

    // Função para deletar despesa
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
                display: 'inline-flex',
                alignItems: 'center',
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: '600',
                borderRadius: '20px',
                backgroundColor: style.bg,
                color: style.color,
                border: `1px solid ${style.border}`,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            }}>
                {style.text}
            </span>
        );
    };

    if (loading) {
        return (
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '48px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px'
            }}>
                <div style={{
                    textAlign: 'center',
                    color: '#64748b'
                }}>
                    <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
                    <div style={{ fontSize: '1.1rem' }}>Carregando detalhes da obra...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '48px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px'
            }}>
                <div style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'center',
                    color: '#b91c1c'
                }}>
                    <div style={{ fontSize: '2rem', marginBottom: '16px' }}>❌</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{error}</div>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '48px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px'
            }}>
                <div style={{
                    textAlign: 'center',
                    color: '#64748b'
                }}>
                    <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🔍</div>
                    <div style={{ fontSize: '1.1rem' }}>Obra não encontrada.</div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '48px'
        }}>

            {/* ✅ BREADCRUMB/NAVEGAÇÃO */}
            <div style={{
                marginBottom: '32px'
            }}>
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
                        marginBottom: '16px',
                        transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#2563eb'}
                    onMouseLeave={(e) => e.target.style.color = '#3b82f6'}
                >
                    ← Voltar para Lista de Obras
                </Link>
            </div>

            {/* ✅ HEADER DA OBRA */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '32px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                marginBottom: '32px'
            }}>

                {/* Header Superior */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '24px'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            color: '#0f172a',
                            margin: '0 0 8px 0',
                            lineHeight: '1.2'
                        }}>
                            {project.contractor} - {project.name}
                        </h1>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            flexWrap: 'wrap'
                        }}>
                            {getStatusBadge(project.status)}
                            <span style={{
                                fontSize: '1rem',
                                color: '#64748b',
                                fontWeight: '500'
                            }}>
                                📍 {project.city}/{project.state}
                            </span>
                        </div>
                    </div>

                    <Link
                        to={`/project/edit/${project.id}`}
                        style={{ textDecoration: 'none' }}
                    >
                        <button style={{
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '12px 24px',
                            fontSize: '1rem',
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
                            ✏️ Editar Obra
                        </button>
                    </Link>
                </div>

                {/* Informações Principais */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '24px',
                    marginBottom: '24px'
                }}>

                    {/* CNO */}
                    <div style={{
                        padding: '16px',
                        backgroundColor: '#eff6ff',
                        borderRadius: '8px',
                        border: '1px solid #bfdbfe'
                    }}>
                        <div style={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#1d4ed8',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: '4px'
                        }}>
                            CNO
                        </div>
                        <div style={{
                            fontSize: '1rem',
                            fontWeight: '700',
                            color: '#1e40af'
                        }}>
                            {project.cno}
                        </div>
                    </div>

                    {/* Responsável */}
                    <div style={{
                        padding: '16px',
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
                            RESPONSÁVEL
                        </div>
                        <div style={{
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: '#166534'
                        }}>
                            {project.responsible}
                        </div>
                    </div>

                    {/* Período */}
                    <div style={{
                        padding: '16px',
                        backgroundColor: '#fef3c7',
                        borderRadius: '8px',
                        border: '1px solid #fbbf24'
                    }}>
                        <div style={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#92400e',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: '4px'
                        }}>
                            PERÍODO
                        </div>
                        <div style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#b45309'
                        }}>
                            {new Date(project.startDate).toLocaleDateString('pt-BR')} - {project.endDate ? new Date(project.endDate).toLocaleDateString('pt-BR') : 'Em andamento'}
                        </div>
                    </div>
                </div>

                {/* Tabs de Navegação */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    borderBottom: '1px solid #f1f5f9'
                }}>
                    {[
                        { id: 'overview', label: '📊 Visão Geral', icon: '📊' },
                        { id: 'contracts', label: '📄 Contratos', icon: '📄' },
                        { id: 'team', label: '👥 Equipe', icon: '👥' },
                        { id: 'expenses', label: '💰 Despesas', icon: '💰' }
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
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                            onMouseEnter={(e) => {
                                if (activeTab !== tab.id) {
                                    e.target.style.backgroundColor = '#f8fafc';
                                    e.target.style.color = '#374151';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeTab !== tab.id) {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = '#64748b';
                                }
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ✅ CONTEÚDO DAS TABS */}

            {/* TAB: VISÃO GERAL */}
            {activeTab === 'overview' && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px'
                }}>

                    {/* Resumo de Contratos */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            color: '#1e293b',
                            margin: '0 0 16px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            📄 Contratos
                        </h3>
                        <div style={{
                            textAlign: 'center',
                            padding: '20px'
                        }}>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: '700',
                                color: '#3b82f6',
                                marginBottom: '8px'
                            }}>
                                {contracts.length}
                            </div>
                            <div style={{
                                fontSize: '0.9rem',
                                color: '#64748b'
                            }}>
                                Contratos Ativos
                            </div>
                        </div>
                        {contracts.length > 0 && (
                            <div style={{
                                borderTop: '1px solid #f1f5f9',
                                paddingTop: '16px',
                                marginTop: '16px'
                            }}>
                                <div style={{
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    marginBottom: '4px'
                                }}>
                                    Valor Total
                                </div>
                                <div style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '700',
                                    color: '#10b981'
                                }}>
                                    {formatCurrency(contracts.reduce((sum, contract) => sum + contract.totalValue, 0))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Resumo da Equipe */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            color: '#1e293b',
                            margin: '0 0 16px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            👥 Equipe
                        </h3>
                        <div style={{
                            textAlign: 'center',
                            padding: '20px'
                        }}>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: '700',
                                color: '#10b981',
                                marginBottom: '8px'
                            }}>
                                {allocations.filter(alloc => !alloc.endDate).length}
                            </div>
                            <div style={{
                                fontSize: '0.9rem',
                                color: '#64748b'
                            }}>
                                Funcionários Ativos
                            </div>
                        </div>
                        {allocations.length > 0 && (
                            <div style={{
                                borderTop: '1px solid #f1f5f9',
                                paddingTop: '16px',
                                marginTop: '16px'
                            }}>
                                <div style={{
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    marginBottom: '4px'
                                }}>
                                    Total de Alocações
                                </div>
                                <div style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '700',
                                    color: '#6366f1'
                                }}>
                                    {allocations.length}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Resumo de Despesas */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                        <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            color: '#1e293b',
                            margin: '0 0 16px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            💰 Despesas
                        </h3>
                        <div style={{
                            textAlign: 'center',
                            padding: '20px'
                        }}>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: '700',
                                color: '#f59e0b',
                                marginBottom: '8px'
                            }}>
                                {project.expenses ? project.expenses.length : 0}
                            </div>
                            <div style={{
                                fontSize: '0.9rem',
                                color: '#64748b'
                            }}>
                                Lançamentos
                            </div>
                        </div>
                        {project.expenses && project.expenses.length > 0 && (
                            <div style={{
                                borderTop: '1px solid #f1f5f9',
                                paddingTop: '16px',
                                marginTop: '16px'
                            }}>
                                <div style={{
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    marginBottom: '4px'
                                }}>
                                    Total Gasto
                                </div>
                                <div style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '700',
                                    color: '#ef4444'
                                }}>
                                    {formatCurrency(project.expenses.reduce((sum, expense) => sum + expense.amount, 0))}
                                </div>
                            </div>
                        )}
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

            {activeTab === 'team' && (                
                <TeamManager projectId={id} />
            )}

            {/* TAB: DESPESAS */}
            {activeTab === 'expenses' && (
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
                            💰 Despesas da Obra
                            <span style={{
                                backgroundColor: '#e0e7ff',
                                color: '#3730a3',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.875rem',
                                fontWeight: '700'
                            }}>
                                {project.expenses ? project.expenses.length : 0}
                            </span>
                        </h2>

                        <button
                            onClick={() => setIsExpenseFormVisible(!isExpenseFormVisible)}
                            style={{
                                backgroundColor: isExpenseFormVisible ? '#6b7280' : '#10b981',
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
                            onMouseEnter={(e) => {
                                if (isExpenseFormVisible) {
                                    e.target.style.backgroundColor = '#4b5563';
                                } else {
                                    e.target.style.backgroundColor = '#059669';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (isExpenseFormVisible) {
                                    e.target.style.backgroundColor = '#6b7280';
                                } else {
                                    e.target.style.backgroundColor = '#10b981';
                                }
                            }}
                        >
                            {isExpenseFormVisible ? '✖️ Cancelar' : '➕ Nova Despesa'}
                        </button>
                    </div>

                    <div style={{ padding: '32px' }}>

                        {/* Formulário de Nova Despesa */}
                        {isExpenseFormVisible && (
                            <div style={{
                                backgroundColor: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                borderRadius: '12px',
                                padding: '24px',
                                marginBottom: '32px'
                            }}>
                                <h3 style={{
                                    fontSize: '1.2rem',
                                    fontWeight: '600',
                                    color: '#166534',
                                    marginBottom: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    💸 Lançar Nova Despesa
                                </h3>

                                {contracts.length === 0 ? (
                                    <div style={{
                                        padding: '20px',
                                        backgroundColor: '#fef3c7',
                                        borderRadius: '8px',
                                        border: '1px solid #f59e0b',
                                        textAlign: 'center'
                                    }}>
                                        <p style={{
                                            color: '#92400e',
                                            margin: '0',
                                            fontWeight: '600'
                                        }}>
                                            ⚠️ Cadastre um contrato para esta obra antes de lançar despesas.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleExpenseSubmit}>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                            gap: '16px',
                                            marginBottom: '20px'
                                        }}>

                                            <div>
                                                <label style={{
                                                    display: 'block',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    color: '#374151',
                                                    marginBottom: '6px'
                                                }}>
                                                    Descrição
                                                </label>
                                                <input
                                                    type="text"
                                                    name="description"
                                                    value={expenseFormData.description}
                                                    onChange={(e) => setExpenseFormData({ ...expenseFormData, description: e.target.value })}
                                                    required
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 16px',
                                                        border: '1px solid #d1d5db',
                                                        backgroundColor: '#dcdedfff',
                                                        color: '#1f2937',
                                                        borderRadius: '8px',
                                                        fontSize: '1rem',
                                                        transition: 'border-color 0.2s ease',
                                                        boxSizing: 'border-box'
                                                    }}
                                                    placeholder="Ex: Cimento Portland"
                                                />
                                            </div>

                                            <div>
                                                <label style={{
                                                    display: 'block',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    color: '#374151',
                                                    marginBottom: '6px'
                                                }}>
                                                    Valor (R$)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    name="amount"
                                                    min="0"
                                                    value={expenseFormData.amount}
                                                    onChange={(e) => setExpenseFormData({ ...expenseFormData, amount: e.target.value })}
                                                    required
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 16px',
                                                        border: '1px solid #d1d5db',
                                                        backgroundColor: '#dcdedfff',
                                                        color: '#1f2937',
                                                        borderRadius: '8px',
                                                        fontSize: '1rem',
                                                        transition: 'border-color 0.2s ease',
                                                        boxSizing: 'border-box'
                                                    }}
                                                    placeholder="0.00"
                                                />
                                            </div>

                                            <div>
                                                <label style={{
                                                    display: 'block',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    color: '#374151',
                                                    marginBottom: '6px'
                                                }}>
                                                    Data
                                                </label>
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={expenseFormData.date}
                                                    onChange={(e) => setExpenseFormData({ ...expenseFormData, date: e.target.value })}
                                                    required
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 16px',
                                                        border: '1px solid #d1d5db',
                                                        backgroundColor: '#dcdedfff',
                                                        color: '#1f2937',
                                                        borderRadius: '8px',
                                                        fontSize: '1rem',
                                                        transition: 'border-color 0.2s ease',
                                                        boxSizing: 'border-box'
                                                    }}
                                                />
                                            </div>

                                            <div>
                                                <label style={{
                                                    display: 'block',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    color: '#374151',
                                                    marginBottom: '6px'
                                                }}>
                                                    Centro de Custo
                                                </label>
                                                <input
                                                    type="text"
                                                    name="costCenterName"
                                                    value={expenseFormData.costCenterName}
                                                    onChange={(e) => setExpenseFormData({ ...expenseFormData, costCenterName: e.target.value })}
                                                    required
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 16px',
                                                        border: '1px solid #d1d5db',
                                                        backgroundColor: '#dcdedfff',
                                                        color: '#1f2937',
                                                        borderRadius: '8px',
                                                        fontSize: '1rem',
                                                        transition: 'border-color 0.2s ease',
                                                        boxSizing: 'border-box'
                                                    }}
                                                    placeholder="Ex: Material"
                                                />
                                            </div>

                                            <div>
                                                <label style={{
                                                    display: 'block',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    color: '#374151',
                                                    marginBottom: '6px'
                                                }}>
                                                    Nº Pessoas (Opcional)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="numberOfPeople"
                                                    value={expenseFormData.numberOfPeople}
                                                    onChange={(e) => setExpenseFormData({ ...expenseFormData, numberOfPeople: e.target.value })}
                                                    min="0"
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 16px',
                                                        border: '1px solid #d1d5db',
                                                        backgroundColor: '#dcdedfff',
                                                        color: '#1f2937',
                                                        borderRadius: '8px',
                                                        fontSize: '1rem',
                                                        transition: 'border-color 0.2s ease',
                                                        boxSizing: 'border-box'
                                                    }}
                                                    placeholder="0"
                                                />
                                            </div>

                                            <div>
                                                <label style={{
                                                    display: 'block',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    color: '#374151',
                                                    marginBottom: '6px'
                                                }}>
                                                    Anexo (NF)
                                                </label>
                                                <input
                                                    type="file"
                                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 16px',
                                                        border: '1px solid #d1d5db',
                                                        backgroundColor: '#dcdedfff',
                                                        color: '#1f2937',
                                                        borderRadius: '8px',
                                                        fontSize: '1rem',
                                                        transition: 'border-color 0.2s ease',
                                                        boxSizing: 'border-box'
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submittingExpense}
                                            style={{
                                                backgroundColor: submittingExpense ? '#9ca3af' : '#10b981',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                padding: '12px 24px',
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                cursor: submittingExpense ? 'not-allowed' : 'pointer',
                                                transition: 'background-color 0.2s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            {submittingExpense ? '⏳ Salvando...' : '💾 Salvar Despesa'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}

                        {/* Lista de Despesas */}
                        <div>
                            <h4 style={{
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                color: '#1e293b',
                                marginBottom: '20px'
                            }}>
                                Despesas Lançadas
                            </h4>

                            {!project.expenses || project.expenses.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '48px',
                                    color: '#64748b'
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💰</div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Nenhuma despesa lançada</h3>
                                    <p style={{ margin: '0' }}>Comece adicionando a primeira despesa desta obra.</p>
                                </div>
                            ) : (
                                <div style={{
                                    display: 'grid',
                                    gap: '16px'
                                }}>
                                    {project.expenses.map(expense => (
                                        <div key={expense.id} style={{
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '12px',
                                            padding: '20px',
                                            transition: 'all 0.2s ease',
                                            backgroundColor: '#fafafa'
                                        }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#f8fafc';
                                                e.currentTarget.style.borderColor = '#c7d2fe';
                                                e.currentTarget.style.transform = 'translateY(-1px)';
                                                e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(0, 0, 0, 0.1)';
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
                                                gridTemplateColumns: 'auto 1fr auto auto',
                                                gap: '20px',
                                                alignItems: 'center'
                                            }}>

                                                {/* Ícone e Info Principal */}
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: '16px'
                                                }}>
                                                    <div style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        backgroundColor: '#fef3c7',
                                                        borderRadius: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '1.5rem',
                                                        border: '2px solid #fbbf24'
                                                    }}>
                                                        💰
                                                    </div>

                                                    <div>
                                                        <h4 style={{
                                                            fontSize: '1.1rem',
                                                            fontWeight: '600',
                                                            color: '#1e293b',
                                                            margin: '0 0 4px 0'
                                                        }}>
                                                            {expense.description}
                                                        </h4>
                                                        <div style={{
                                                            fontSize: '0.875rem',
                                                            color: '#64748b',
                                                            marginBottom: '4px'
                                                        }}>
                                                            📅 {new Date(expense.date).toLocaleDateString('pt-BR')}
                                                        </div>
                                                        <div style={{
                                                            fontSize: '0.875rem',
                                                            color: '#6366f1',
                                                            fontWeight: '500'
                                                        }}>
                                                            🏷️ {expense.costCenterName}
                                                        </div>
                                                        {expense.numberOfPeople && (
                                                            <div style={{
                                                                fontSize: '0.875rem',
                                                                color: '#64748b'
                                                            }}>
                                                                👥 {expense.numberOfPeople} pessoas
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Valor */}
                                                <div style={{
                                                    textAlign: 'center',
                                                    padding: '12px',
                                                    backgroundColor: '#fef2f2',
                                                    borderRadius: '8px',
                                                    border: '1px solid #fecaca'
                                                }}>
                                                    <div style={{
                                                        fontSize: '0.75rem',
                                                        fontWeight: '600',
                                                        color: '#991b1b',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px',
                                                        marginBottom: '4px'
                                                    }}>
                                                        VALOR
                                                    </div>
                                                    <div style={{
                                                        fontSize: '1.1rem',
                                                        fontWeight: '700',
                                                        color: '#dc2626'
                                                    }}>
                                                        {formatCurrency(expense.amount)}
                                                    </div>
                                                </div>

                                                {/* Anexo */}
                                                <div style={{
                                                    textAlign: 'center'
                                                }}>
                                                    {expense.attachmentPath ? (
                                                        <a
                                                            href={`http://localhost:5145${expense.attachmentPath}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '6px',
                                                                padding: '8px 12px',
                                                                backgroundColor: '#e0e7ff',
                                                                color: '#3730a3',
                                                                textDecoration: 'none',
                                                                borderRadius: '6px',
                                                                fontSize: '0.875rem',
                                                                fontWeight: '600',
                                                                border: '1px solid #c7d2fe',
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.target.style.backgroundColor = '#c7d2fe';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.target.style.backgroundColor = '#e0e7ff';
                                                            }}
                                                        >
                                                            📎 Ver Anexo
                                                        </a>
                                                    ) : (
                                                        <span style={{
                                                            fontSize: '0.875rem',
                                                            color: '#9ca3af'
                                                        }}>
                                                            Sem anexo
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Ações */}
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center', // Centraliza os botões na célula
                                                    gap: '8px'
                                                }}>
                                                    {/* A verificação condicional envolve os dois botões */}
                                                    {!expense.isVirtual && (
                                                        <>
                                                            <Link
                                                                to={`/expense/edit/${expense.id}`}
                                                                style={{ textDecoration: 'none' }}
                                                            >
                                                                <button style={{
                                                                    backgroundColor: '#3b82f6',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    borderRadius: '6px',
                                                                    padding: '6px 12px',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: '600',
                                                                    cursor: 'pointer',
                                                                    transition: 'background-color 0.2s ease',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px'
                                                                }}
                                                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                                                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                                                                >
                                                                    ✏️ Editar
                                                                </button>
                                                            </Link>

                                                            <button
                                                                onClick={() => handleDeleteExpense(expense.id)}
                                                                style={{
                                                                    backgroundColor: '#ef4444',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    borderRadius: '6px',
                                                                    padding: '6px 12px',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: '600',
                                                                    cursor: 'pointer',
                                                                    transition: 'background-color 0.2s ease',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px'
                                                                }}
                                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                                                                onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                                                            >
                                                                🗑️ Deletar
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Total de Despesas */}
                            {project.expenses && project.expenses.length > 0 && (
                                <div style={{
                                    marginTop: '24px',
                                    padding: '20px',
                                    backgroundColor: '#f8fafc',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    textAlign: 'center'
                                }}>
                                    <div style={{
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: '#64748b',
                                        marginBottom: '8px'
                                    }}>
                                        TOTAL GASTO NA OBRA
                                    </div>
                                    <div style={{
                                        fontSize: '2rem',
                                        fontWeight: '700',
                                        color: '#dc2626'
                                    }}>
                                        {formatCurrency(project.expenses.reduce((sum, expense) => sum + expense.amount, 0))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <AddContractModal
                isOpen={showAddContractModal}
                onClose={handleCloseContractModal}
                projectId={id}
                projectName={`${project.contractor} - ${project.name}`}
                onContractAdded={handleContractAdded}
            />
        </div>
    );
};

export default WorkDetails;