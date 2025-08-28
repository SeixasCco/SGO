import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [loading, setLoading] = useState(true);
   
    useEffect(() => {
        axios.get('http://localhost:5145/api/companies')
            .then(response => {
                const fetchedCompanies = response.data || [];
                setCompanies(fetchedCompanies);
               
                const savedCompanyId = localStorage.getItem('selectedCompanyId');
                const savedCompany = fetchedCompanies.find(c => c.id === savedCompanyId);

                if (savedCompany) {
                    setSelectedCompany(savedCompany);
                } else if (fetchedCompanies.length > 0) {                    
                    setSelectedCompany(fetchedCompanies[0]);
                    localStorage.setItem('selectedCompanyId', fetchedCompanies[0].id);
                }
            })
            .catch(() => {
                console.error("Erro ao buscar empresas.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const switchCompany = (companyId) => {
        const company = companies.find(c => c.id === companyId);
        if (company) {
            setSelectedCompany(company);
            localStorage.setItem('selectedCompanyId', company.id);
            window.location.reload(); 
        }
    };

    const value = {
        companies,
        selectedCompany,
        loading,
        switchCompany
    };

    return (
        <CompanyContext.Provider value={value}>
            {children}
        </CompanyContext.Provider>
    );
};

export const useCompany = () => {
    return useContext(CompanyContext);
};