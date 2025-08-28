import React from 'react';
import { useCompany } from '../../context/CompanyContext';

const CompanySwitcher = () => {
    const { companies, selectedCompany, switchCompany, loading } = useCompany();

    if (loading) {
        return <select className="form-select" disabled><option>Carregando...</option></select>;
    }

    if (!selectedCompany) {
        return <div style={{color: '#ef4444', fontWeight: 500}}>Nenhuma empresa!</div>;
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>Operando em:</span>
            <select
                className="form-select"
                value={selectedCompany.id}
                onChange={(e) => switchCompany(e.target.value)}
                style={{ minWidth: '200px', fontWeight: 600 }}
            >
                {companies.map(company => (
                    <option key={company.id} value={company.id}>
                        {company.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CompanySwitcher;