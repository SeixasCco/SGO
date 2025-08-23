import React, { useState } from 'react';
import axios from 'axios';

const AddContractModal = ({ isOpen, onClose, projectId, projectName, onContractAdded }) => {
    const [formData, setFormData] = useState({
        contractNumber: '',
        title: '',
        totalValue: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        observations: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const contractData = {
                projectId: projectId,
                contractNumber: formData.contractNumber.trim(),
                title: formData.title.trim(),
                totalValue: parseFloat(formData.totalValue) || 0,
                startDate: formData.startDate,
                endDate: formData.endDate || null,
                observations: formData.observations.trim() || null
            };

            await axios.post('http://localhost:5145/api/contracts', contractData);

            // Reset form
            setFormData({
                contractNumber: '',
                title: '',
                totalValue: '',
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
                observations: ''
            });

            onContractAdded();
            onClose();
        } catch (err) {
            console.error('Erro ao criar contrato:', err);
            setError(err.response?.data || 'Erro ao criar contrato. Verifique os dados.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            contractNumber: '',
            title: '',
            totalValue: '',
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            observations: ''
        });
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '0',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>

                {/* Header */}
                <div style={{
                    padding: '24px 32px',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            color: '#1e293b',
                            margin: '0 0 4px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            📄 Novo Contrato
                        </h2>
                        <p style={{
                            fontSize: '0.875rem',
                            color: '#64748b',
                            margin: '0'
                        }}>
                            Obra: <strong>{projectName}</strong>
                        </p>
                    </div>

                    <button
                        onClick={handleCancel}
                        style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: '#64748b',
                            padding: '4px',
                            borderRadius: '4px',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#f1f5f9';
                            e.target.style.color = '#374151';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#64748b';
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} style={{ padding: '32px' }}>

                    {/* Error Message */}
                    {error && (
                        <div style={{
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#dc2626',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            fontSize: '0.875rem'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Grid de Campos */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '20px',
                        marginBottom: '24px'
                    }}>

                        {/* Número do Contrato */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '8px'
                            }}>
                                Número do Contrato *
                            </label>
                            <input
                                type="text"
                                name="contractNumber"
                                value={formData.contractNumber}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #404040',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    backgroundColor: '#dcdedfff',
                                    color: '#1f2937',
                                    fontWeight: '600',
                                    boxSizing: 'border-box',
                                    transition: 'border-color 0.2s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#404040'}
                                placeholder="Ex: T30/2025, CONT-001/2024..."
                            />
                        </div>

                        {/* Título */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '8px'
                            }}>
                                Título do Contrato *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #404040',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    backgroundColor: '#dcdedfff',
                                    color: '#1f2937',
                                    fontWeight: '600',
                                    boxSizing: 'border-box',
                                    transition: 'border-color 0.2s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#404040'}
                                placeholder="Ex: Construção Supermercado, Reforma Comercial..."
                            />
                        </div>

                        {/* Valor Total */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '8px'
                            }}>
                                Valor Total (R$) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="totalValue"
                                value={formData.totalValue}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #404040',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    backgroundColor: '#dcdedfff',
                                    color: '#1f2937',
                                    fontWeight: '600',
                                    boxSizing: 'border-box',
                                    transition: 'border-color 0.2s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#404040'}
                                placeholder="0.00"
                            />
                        </div>

                        {/* Data de Início */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '8px'
                            }}>
                                Data de Início *
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #404040',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    backgroundColor: '#dcdedfff',
                                    color: '#1f2937',
                                    fontWeight: '600',
                                    boxSizing: 'border-box',
                                    transition: 'border-color 0.2s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#404040'}
                            />
                        </div>

                        {/* Data de Fim */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '8px'
                            }}>
                                Data de Fim (Opcional)
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #404040',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    backgroundColor: '#dcdedfff',
                                    color: '#1f2937',
                                    fontWeight: '600',
                                    boxSizing: 'border-box',
                                    transition: 'border-color 0.2s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#404040'}
                            />
                        </div>
                    </div>

                    {/* Observações */}
                    <div style={{ marginBottom: '32px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '8px'
                        }}>
                            Observações (Opcional)
                        </label>
                        <textarea
                            name="observations"
                            value={formData.observations}
                            onChange={handleChange}
                            rows="3"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #404040',
                                borderRadius: '8px',
                                fontSize: '1rem',  
                                fontWeight: '600',
                                backgroundColor: '#dcdedfff',
                                color: '#1f2937',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.2s ease',
                                resize: 'vertical',
                                minHeight: '80px'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#404040'}
                            placeholder="Detalhes adicionais sobre o contrato..."
                        />
                    </div>

                    {/* Buttons */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '12px',
                        paddingTop: '20px',
                        borderTop: '1px solid #e2e8f0'
                    }}>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={submitting}
                            style={{
                                backgroundColor: 'transparent',
                                color: '#64748b',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                padding: '12px 24px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                if (!submitting) {
                                    e.target.style.backgroundColor = '#f8fafc';
                                    e.target.style.borderColor = '#9ca3af';
                                    e.target.style.color = '#374151';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!submitting) {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.borderColor = '#d1d5db';
                                    e.target.style.color = '#64748b';
                                }
                            }}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                backgroundColor: submitting ? '#9ca3af' : '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '12px 24px',
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
                            {submitting ? (
                                <>
                                    <div style={{
                                        width: '16px',
                                        height: '16px',
                                        border: '2px solid #ffffff',
                                        borderTop: '2px solid transparent',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }} />
                                    Criando...
                                </>
                            ) : (
                                <>
                                    💾 Criar Contrato
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <style>
                {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(1);
            cursor: pointer;
          }
        `}
            </style>
        </div>
    );
};

export default AddContractModal;