// Local: frontend/src/pages/EditExpensePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const EditExpensePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [projectInfo, setProjectInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:5145/api/projectexpenses/${id}`)
            .then(response => {
                const expense = response.data;
                expense.date = new Date(expense.date).toISOString().split('T')[0];
                setFormData(expense);

                // Buscar informações do projeto
                return axios.get(`http://localhost:5145/api/projects/${expense.projectId}`);
            })
            .then(projectResponse => {
                setProjectInfo(projectResponse.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Não foi possível carregar os dados da despesa.');
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const expenseDto = {
            id: formData.id,
            projectId: formData.projectId,
            contractId: formData.contractId,
            costCenterId: formData.costCenterId,
            description: formData.description,
            amount: parseFloat(formData.amount),
            date: formData.date,
            attachmentPath: formData.attachmentPath
        };

        axios.put(`http://localhost:5145/api/projectexpenses/${id}`, expenseDto)
            .then(() => {
                alert('Despesa atualizada com sucesso!');
                navigate(`/project/${formData.projectId}`);
            })
            .catch(err => {
                if (err.response && err.response.data && err.response.data.errors) {
                    const errorMessages = Object.values(err.response.data.errors).flat();
                    setError(errorMessages.join('\n'));
                } else {
                    setError('Falha ao atualizar a despesa. Verifique a conexão e os dados.');
                }
                console.error("Erro ao atualizar despesa:", err);
                setSubmitting(false);
            });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
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
                    <div style={{ fontSize: '1.1rem' }}>Carregando dados da despesa...</div>
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

    if (!formData) {
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
                    <div style={{ fontSize: '1.1rem' }}>Despesa não encontrada.</div>
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
                    to={`/project/${formData.projectId}`}
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
                    ← Voltar para a Obra
                </Link>

                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    color: '#0f172a',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    ✏️ Editando Despesa
                </h1>
                <p style={{
                    fontSize: '1.1rem',
                    color: '#64748b',
                    margin: '0'
                }}>
                    Atualize os dados da despesa <strong>{formData.description}</strong>
                </p>
            </div>

            {/* ✅ INFORMAÇÕES DA OBRA */}
            {projectInfo && (
                <div style={{
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '32px'
                }}>
                    <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: '#166534',
                        margin: '0 0 12px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        🏗️ Informações da Obra
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px'
                    }}>
                        <div>
                            <span style={{ fontSize: '0.875rem', color: '#15803d', fontWeight: '600' }}>Nome:</span>
                            <div style={{ fontSize: '1rem', color: '#166534', fontWeight: '500' }}>
                                {projectInfo.contractor} - {projectInfo.name}
                            </div>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.875rem', color: '#15803d', fontWeight: '600' }}>CNO:</span>
                            <div style={{ fontSize: '1rem', color: '#166534', fontWeight: '500' }}>
                                {projectInfo.cno}
                            </div>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.875rem', color: '#15803d', fontWeight: '600' }}>Local:</span>
                            <div style={{ fontSize: '1rem', color: '#166534', fontWeight: '500' }}>
                                {projectInfo.city}/{projectInfo.state}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ FORMULÁRIO DE EDIÇÃO MODERNIZADO */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '32px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>

                {/* Header da Despesa */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    marginBottom: '32px',
                    padding: '24px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '12px',
                    border: '1px solid #f59e0b'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#f59e0b',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        border: '3px solid #fbbf24'
                    }}>
                        💰
                    </div>
                    <div>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            color: '#92400e',
                            margin: '0 0 8px 0'
                        }}>
                            {formData.description}
                        </h2>
                        <div style={{
                            display: 'flex',
                            gap: '16px',
                            flexWrap: 'wrap'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 12px',
                                backgroundColor: '#fed7aa',
                                borderRadius: '16px',
                                border: '1px solid #f97316'
                            }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#9a3412' }}>
                                    💵 {formatCurrency(formData.amount)}
                                </span>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 12px',
                                backgroundColor: '#e0e7ff',
                                borderRadius: '16px',
                                border: '1px solid #c7d2fe'
                            }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#3730a3' }}>
                                    📅 {new Date(formData.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 12px',
                                backgroundColor: '#f3e8ff',
                                borderRadius: '16px',
                                border: '1px solid #d8b4fe'
                            }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#7c3aed' }}>
                                    🏷️ {formData.costCenter?.name || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* Campos de Edição */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '24px',
                        marginBottom: '32px'
                    }}>

                        {/* Descrição */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '8px'
                            }}>
                                Descrição da Despesa
                            </label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
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
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                placeholder="Ex: Cimento Portland, Mão de obra, Transporte..."
                            />
                        </div>

                        {/* Valor */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '8px'
                            }}>
                                Valor (R$)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="amount"
                                value={formData.amount}
                                min="0"
                                onChange={handleChange}
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
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                placeholder="0.00"
                            />
                            <div style={{
                                fontSize: '0.875rem',
                                color: '#64748b',
                                marginTop: '4px'
                            }}>
                                Use ponto (.) para separar decimais: 1234.56
                            </div>
                        </div>

                        {/* Data */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '8px'
                            }}>
                                Data da Despesa
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
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
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                        </div>

                        {/* Centro de Custo (Somente Leitura) */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '8px'
                            }}>
                                Centro de Custo
                            </label>
                            <input
                                id="costCenter"
                                type="text"
                                value={formData.costCenter?.name || 'Não informado'}
                                disabled
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    backgroundColor: '#dcdedfff',
                                    color: '#1f2937',
                                    cursor: 'not-allowed',
                                    boxSizing: 'border-box'
                                }}
                            />
                            <div style={{
                                fontSize: '0.875rem',
                                color: '#64748b',
                                marginTop: '4px'
                            }}>
                                ⚠️ O centro de custo não pode ser alterado após a criação
                            </div>
                        </div>
                    </div>

                    {/* Informações do Anexo */}
                    {formData.attachmentPath && (
                        <div style={{
                            backgroundColor: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            borderRadius: '8px',
                            padding: '16px',
                            marginBottom: '32px'
                        }}>
                            <h4 style={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                color: '#1e40af',
                                margin: '0 0 8px 0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                📎 Anexo da Despesa
                            </h4>
                            <p style={{
                                fontSize: '0.875rem',
                                color: '#3730a3',
                                margin: '0 0 12px 0'
                            }}>
                                Esta despesa possui um anexo (nota fiscal ou comprovante).
                            </p>
                            <a
                                href={`http://localhost:5145${formData.attachmentPath}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 16px',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    transition: 'background-color 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                            >
                                👁️ Visualizar Anexo
                            </a>
                        </div>
                    )}

                    {/* Botões de Ação */}
                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        alignItems: 'center',
                        paddingTop: '24px',
                        borderTop: '1px solid #f1f5f9'
                    }}>
                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                backgroundColor: submitting ? '#9ca3af' : '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '14px 32px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                transition: 'background-color 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                            onMouseEnter={(e) => {
                                if (!submitting) e.target.style.backgroundColor = '#059669';
                            }}
                            onMouseLeave={(e) => {
                                if (!submitting) e.target.style.backgroundColor = '#10b981';
                            }}
                        >
                            {submitting ? '⏳ Salvando...' : '💾 Salvar Alterações'}
                        </button>

                        <Link
                            to={`/project/${formData.projectId}`}
                            style={{
                                textDecoration: 'none'
                            }}
                        >
                            <button
                                type="button"
                                style={{
                                    backgroundColor: 'transparent',
                                    color: '#64748b',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    padding: '14px 24px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#f8fafc';
                                    e.target.style.borderColor = '#9ca3af';
                                    e.target.style.color = '#374151';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.borderColor = '#d1d5db';
                                    e.target.style.color = '#64748b';
                                }}
                            >
                                Cancelar
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditExpensePage;