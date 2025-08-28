import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));        
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.username || !formData.password) {
            setError('Por favor, preencha todos os campos');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await login(formData.username, formData.password);
            navigate('/'); 
        } catch (err) {
            setError(err.message || 'Erro ao fazer login');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '48px',
                width: '100%',
                maxWidth: '420px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid #e2e8f0'
            }}>
                {/* Logo/Título */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '40px'
                }}>
                    <div style={{
                        fontSize: '3rem',
                        marginBottom: '12px'
                    }}>🏗️</div>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        color: '#1e293b',
                        margin: '0 0 8px 0'
                    }}>
                        SGO System
                    </h1>
                    <p style={{
                        color: '#64748b',
                        margin: '0',
                        fontSize: '1rem'
                    }}>
                        Sistema de Gestão de Obras
                    </p>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit}>
                    <div className="form-grid" style={{ gap: '24px' }}>
                        <div className="form-group">
                            <label className="form-label">
                                👤 Usuário
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Digite seu usuário"
                                disabled={isSubmitting}
                                autoFocus
                                style={{
                                    fontSize: '1.1rem',
                                    padding: '16px'
                                }}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                🔒 Senha
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Digite sua senha"
                                disabled={isSubmitting}
                                style={{
                                    fontSize: '1.1rem',
                                    padding: '16px'
                                }}
                            />
                        </div>

                        {error && (
                            <div className="form-error-message">
                                ⚠️ {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="form-button"
                            disabled={isSubmitting}
                            style={{
                                width: '100%',
                                padding: '16px',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                marginTop: '8px'
                            }}
                        >
                            {isSubmitting ? (
                                <>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        borderRadius: '50%',
                                        borderTop: '2px solid white',
                                        animation: 'spin 1s linear infinite'
                                    }}></div>
                                    Entrando...
                                </>
                            ) : (
                                <>
                                    🚀 Entrar no Sistema
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Credenciais de teste */}
                <div style={{
                    marginTop: '32px',
                    padding: '20px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                }}>
                    <h3 style={{
                        margin: '0 0 12px 0',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#475569',
                        textAlign: 'center'
                    }}>
                        📋 Credenciais de Teste
                    </h3>
                    <div style={{
                        display: 'grid',
                        gap: '8px',
                        fontSize: '0.875rem',
                        color: '#64748b'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span><strong>Usuário:</strong></span>
                            <code style={{
                                backgroundColor: '#e2e8f0',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '0.8rem'
                            }}>admin</code>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span><strong>Senha:</strong></span>
                            <code style={{
                                backgroundColor: '#e2e8f0',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '0.8rem'
                            }}>sgo2025</code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;