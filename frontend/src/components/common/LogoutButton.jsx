import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const LogoutButton = () => {
    const [showConfirm, setShowConfirm] = useState(false);
    const { logout } = useAuth();

    const handleLogoutClick = () => {
        setShowConfirm(true);
    };

    const handleConfirmLogout = () => {
        logout();
    };

    const handleCancel = () => {
        setShowConfirm(false);
    };

    if (showConfirm) {
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
                    padding: '32px',
                    maxWidth: '400px',
                    width: '90%',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}>
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '24px'
                    }}>
                        <div style={{
                            fontSize: '2.5rem',
                            marginBottom: '16px'
                        }}>🚪</div>
                        <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            color: '#1e293b',
                            margin: '0 0 8px 0'
                        }}>
                            Sair do Sistema
                        </h3>
                        <p style={{
                            color: '#64748b',
                            margin: '0'
                        }}>
                            Tem certeza que deseja sair? Você precisará fazer login novamente.
                        </p>
                    </div>
                    
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        justifyContent: 'center'
                    }}>
                        <button
                            onClick={handleCancel}
                            className="form-button-secondary"
                            style={{ minWidth: '100px' }}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirmLogout}
                            className="form-button-danger"
                            style={{ minWidth: '100px' }}
                        >
                            🚪 Sair
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={handleLogoutClick}
            style={{
                backgroundColor: 'transparent',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                color: '#64748b',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
            }}
            onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#fef2f2';
                e.target.style.borderColor = '#fecaca';
                e.target.style.color = '#dc2626';
            }}
            onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.color = '#64748b';
            }}
        >
            🚪 Sair
        </button>
    );
};

export default LogoutButton;