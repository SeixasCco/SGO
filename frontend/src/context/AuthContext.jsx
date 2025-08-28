import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios'; 

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

    useEffect(() => {
        const token = localStorage.getItem('sgo_auth_token');
        if (token) {
            setIsAuthenticated(true);          
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setIsLoading(false);
    }, []);

    const login = async (username, password) => {
        try {          
            const response = await axios.post('http://localhost:5145/api/auth/login', {
                username,
                password
            });

            const { accessToken } = response.data;         
            localStorage.setItem('sgo_auth_token', accessToken);           
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {           
            throw new Error(error.response?.data || 'Erro de rede ao tentar fazer login.');
        }
    };

    const logout = () => {
        localStorage.removeItem('sgo_auth_token');
        localStorage.removeItem('selectedCompanyId');    
        delete axios.defaults.headers.common['Authorization'];
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