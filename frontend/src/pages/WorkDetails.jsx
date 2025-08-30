import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

import StatusBadge from '../components/common/StatusBadge';
import InfoCard from '../components/common/InfoCard';
import ContractCard from '../components/common/ContractCard';
import ExpenseRow from '../components/common/ExpenseRow';

import AddContractModal from '../components/AddContractModal';
import TeamManager from '../components/TeamManager';
import AddExpenseModal from '../components/AddExpenseModal';
import AttachmentPreviewModal from '../components/AttachmentPreviewModal';

import "../styles/forms.css";

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
    const [loadingContracts, setLoadingContracts] = useState(false);
    const [previewAttachment, setPreviewAttachment] = useState(null);

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

    const handlePreview = (attachmentPath) => {
        setPreviewAttachment({ path: attachmentPath, invoiceNumber: '' });
    };

    const handleTeamUpdate = useCallback(() => {
        fetchTeamData();
        fetchProjectDetails();
    }, [fetchTeamData, fetchProjectDetails]);

    useEffect(() => {
        fetchProjectDetails();
        fetchContracts();
        fetchTeamData();
    }, [id, fetchProjectDetails, fetchContracts, fetchTeamData]);

    const handleContractAdded = () => {
        setShowAddContractModal(false);
        fetchContracts();
        fetchProjectDetails();
    };

    const handleDeleteContract = (contractId) => {
        if (window.confirm("Tem certeza que deseja deletar este contrato?")) {
            const promise = axios.delete(`http://localhost:5145/api/contracts/${contractId}`);
            toast.promise(promise, {
                loading: 'Deletando contrato...',
                success: () => {
                    fetchContracts();
                    fetchProjectDetails();
                    return "Contrato deletado com sucesso!";
                },
                error: (err) => err.response?.data || "Erro ao deletar contrato. Verifique as dependências."
            });
        }
    };


    const handleDeleteExpense = (expenseId) => {
        if (window.confirm("Tem certeza que deseja deletar esta despesa?")) {
            axios.delete(`http://localhost:5145/api/projectexpenses/${expenseId}`)
                .then(() => {
                    toast.success("Despesa deletada com sucesso!");
                    fetchProjectDetails();
                })
                .catch(error => {
                    console.error("Erro ao deletar despesa:", error);
                    toast.error("Falha ao deletar a despesa.");
                });
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    if (loading) return <div className="loading-state">Carregando...</div>;
    if (error) return <div className="form-error-message">{error}</div>;
    if (!project) return <div className="form-error-message">Projeto não encontrado.</div>;

    return (
        <div className="page-container">
            {/* Modais */}
            <AddContractModal
                isOpen={showAddContractModal}
                onClose={() => setShowAddContractModal(false)}
                projectId={id}
                projectName={`${project.contractor} - ${project.name}`}
                onContractAdded={handleContractAdded}
            />

            {isExpenseModalOpen && (
                <AddExpenseModal
                    onClose={() => setIsExpenseModalOpen(false)}
                    onExpenseAdded={() => {
                        setIsExpenseModalOpen(false);
                        fetchProjectDetails();
                    }}
                    projectId={id}
                    contractId={contracts.length > 0 ? contracts[0].id : null}
                />
            )}

            {previewAttachment && (
                <AttachmentPreviewModal
                    attachmentPath={previewAttachment.path}
                    invoiceNumber={previewAttachment.invoiceNumber}
                    onClose={() => setPreviewAttachment(null)}
                />
            )}

            {/* Breadcrumb */}
            <div className="breadcrumb">
                <Link to="/projects" className="breadcrumb-link">
                    ← Voltar para Lista de Obras
                </Link>
            </div>

            {/* Header da Obra */}
            <div className="form-container">
                <div className="project-header">
                    <div className="project-title-section">
                        <h1 className="project-title">
                            {project.contractor} - {project.name}
                        </h1>
                        <div className="project-meta">
                            <StatusBadge status={project.status} />
                            <span className="project-location">
                                📍 {project.city}/{project.state}
                            </span>
                        </div>
                    </div>
                    <Link to={`/project/edit/${id}`} className="form-button">
                        ✏️ Editar Obra
                    </Link>
                </div>

                <div className="form-grid">
                    <InfoCard
                        title="MATRIZ"
                        value={project.companyName}
                        icon="🏢"
                        colorClass="info-card-purple"
                    />
                    <InfoCard
                        title="CNPJ DA OBRA"
                        value={project.cnpj}
                        icon="📄"
                        colorClass="info-card-blue"
                    />
                    <InfoCard
                        title="CONTRATANTE"
                        value={project.contractor}
                        icon="🤝"
                        colorClass="info-card-orange"
                    />
                    <InfoCard
                        title="CNO"
                        value={project.cno}
                        icon="📄"
                        colorClass="info-card-blue"
                    />
                    <InfoCard
                        title="RESPONSÁVEL"
                        value={project.responsible}
                        icon="👤"
                        colorClass="info-card-green"
                    />
                    <InfoCard
                        title="PERÍODO"
                        value={`${new Date(project.startDate).toLocaleDateString('pt-BR')} - ${project.endDate ? new Date(project.endDate).toLocaleDateString('pt-BR') : 'Em andamento'}`}
                        icon="📅"
                        colorClass="info-card-yellow"
                    />
                </div>
            </div>

            {/* Navegação por Abas */}
            <div className="tabs-navigation">
                {[
                    { id: 'overview', label: '📊 Visão Geral' },
                    { id: 'contracts', label: '📄 Contratos' },
                    { id: 'team', label: '👥 Equipe' },
                    { id: 'expenses', label: '💰 Despesas' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`tab-button ${activeTab === tab.id ? 'tab-button-active' : ''}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Conteúdo das Tabs */}
            <div className="tab-content">
                {/* TAB: VISÃO GERAL */}
                {activeTab === 'overview' && (
                    <div className="form-grid">
                        <InfoCard
                            title="📄 Contratos"
                            value={formatCurrency(contracts.reduce((sum, contract) => sum + contract.totalValue, 0))}
                            subtitle={`em ${contracts.length} contrato(s) ativo(s)`}
                            colorClass="info-card-blue"
                        />
                        <InfoCard
                            title="👥 Equipe"
                            value={allocations.filter(alloc => !alloc.endDate).length}
                            subtitle="Funcionários Ativos"
                            colorClass="info-card-green"
                        />
                        <InfoCard
                            title="💰 Despesas"
                            value={formatCurrency(project.expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0)}
                            subtitle="Total Gasto"
                            colorClass="info-card-red"
                        />
                    </div>
                )}

                {/* TAB: CONTRATOS */}
                {activeTab === 'contracts' && (
                    <div className="section-container">
                        <div className="section-header">
                            <h2 className="section-title">
                                📄 Contratos da Obra
                                <span className="count-badge">{contracts.length}</span>
                            </h2>
                            <button
                                onClick={() => setShowAddContractModal(true)}
                                className="form-button"
                            >
                                ➕ Adicionar Contrato
                            </button>
                        </div>

                        <div className="section-body">
                            {loadingContracts ? (
                                <div className="empty-state">
                                    <div className="empty-state-icon">⏳</div>
                                    <div className="empty-state-message">Carregando contratos...</div>
                                </div>
                            ) : contracts.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-state-icon">📄</div>
                                    <h3 className="empty-state-title">Nenhum contrato cadastrado</h3>
                                    <p className="empty-state-description">Comece adicionando o primeiro contrato da obra.</p>
                                </div>
                            ) : (
                                <div className="contracts-list">
                                    {contracts.map(contract => (
                                        <ContractCard
                                            key={contract.id}
                                            contract={contract}
                                            onEdit={(id) => window.location.href = `/contract/edit/${id}`}
                                            onDelete={handleDeleteContract}
                                            formatCurrency={formatCurrency}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB: EQUIPE */}
                {activeTab === 'team' && (
                    <TeamManager
                        projectId={id}
                        allocations={allocations}
                        onTeamUpdate={handleTeamUpdate}
                    />
                )}

                {/* TAB: DESPESAS */}
                {activeTab === 'expenses' && (
                    <div className="section-container">
                        <div className="section-header">
                            <h2 className="section-title">💰 Despesas Lançadas</h2>
                            <button
                                onClick={() => setIsExpenseModalOpen(true)}
                                className="form-button"
                            >
                                ➕ Nova Despesa
                            </button>
                        </div>

                        <div className="section-body">
                            {!project.expenses || project.expenses.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-state-icon">📋</div>
                                    <div className="empty-state-message">Nenhuma despesa lançada para esta obra.</div>
                                </div>
                            ) : (
                                <div className="expenses-list">
                                    {project.expenses.map(expense => (
                                        <ExpenseRow
                                            key={expense.id}
                                            expense={expense}
                                            onEdit={(id) => window.location.href = `/expense/edit/${id}`}
                                            onDelete={handleDeleteExpense}
                                            formatCurrency={formatCurrency}
                                            onPreview={handlePreview}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkDetails;