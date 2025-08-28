import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  
    const DEFAULT_CREDENTIALS = {
        username: 'admin',
        password: 'sgo2025'
    };

    useEffect(() => {       
        const token = localStorage.getItem('sgo_auth_token');
        if (token) {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = (username, password) => {
        return new Promise((resolve, reject) => {           
            setTimeout(() => {
                if (username === DEFAULT_CREDENTIALS.username && password === DEFAULT_CREDENTIALS.password) {                  
                    const token = btoa(`${username}:${Date.now()}`);
                    localStorage.setItem('sgo_auth_token', token);
                    setIsAuthenticated(true);
                    resolve({ success: true });
                } else {
                    reject({ message: 'Usuário ou senha inválidos' });
                }
            }, 1000);
        });
    };

    const logout = () => {
        localStorage.removeItem('sgo_auth_token');
        localStorage.removeItem('selectedCompanyId'); 
        setIsAuthenticated(false);
        window.location.href = '/login'; 
    };

    const value = {
        isAuthenticated,
        isLoading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};