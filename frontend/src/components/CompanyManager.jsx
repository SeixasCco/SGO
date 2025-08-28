import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCompany } from '../context/CompanyContext';

import FormGroup from './common/FormGroup';
import StyledInput from './common/StyledInput';

const CompanyManager = () => {
    const { companies, switchCompany } = useCompany();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: '', cnpj: '' });
    const [editingCompany, setEditingCompany] = useState(null);

    const handleEdit = (company) => {
        setEditingCompany(company);
        setFormData({ id: company.id, name: company.name, cnpj: company.cnpj });
        setIsFormVisible(true);
    };

    const handleAddNew = () => {
        setEditingCompany(null);
        setFormData({ id: null, name: '', cnpj: '' });
        setIsFormVisible(true);
    };
    
    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingCompany(null);
        setFormData({ id: null, name: '', cnpj: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const promise = formData.id
            ? axios.put(`http://localhost:5145/api/companies/${formData.id}`, formData)
            : axios.post('http://localhost:5145/api/companies', { name: formData.name, cnpj: formData.cnpj });

        toast.promise(promise, {
            loading: 'Salvando empresa...',
            success: (res) => {                
                window.location.reload();
                return 'Empresa salva com sucesso!';
            },
            error: (err) => err.response?.data || 'Falha ao salvar a empresa.'
        });
    };

    const handleDelete = (companyId) => {
        if (window.confirm('Tem certeza que deseja deletar esta empresa?')) {
            const promise = axios.delete(`http://localhost:5145/api/companies/${companyId}`);
            toast.promise(promise, {
                loading: 'Deletando...',
                success: () => {
                    window.location.reload();
                    return 'Empresa deletada!';
                },
                error: (err) => err.response?.data || 'Falha ao deletar.'
            });
        }
    };

    return (
        <div className="card">
            <div className="section-header">
                <h2 className="section-title">🏢 Gestão de Empresas</h2>
                {!isFormVisible && (
                    <button onClick={handleAddNew} className="form-button">
                        + Nova Empresa
                    </button>
                )}
            </div>

            {isFormVisible && (
                <div className="form-section">
                    <h3 className="section-divider" style={{marginTop: 0}}>
                        {editingCompany ? `Editando "${editingCompany.name}"` : 'Cadastrar Nova Empresa'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <FormGroup label="Nome da Empresa">
                                <StyledInput type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                            </FormGroup>
                            <FormGroup label="CNPJ">
                                <StyledInput type="text" name="cnpj" value={formData.cnpj} onChange={(e) => setFormData({...formData, cnpj: e.target.value})} required />
                            </FormGroup>
                        </div>
                        <div className="modal-footer" style={{ borderTop: 'none', paddingTop: '16px', justifyContent: 'flex-start' }}>
                            <button type="submit" className="form-button">Salvar</button>
                            <button type="button" onClick={handleCancel} className="form-button-secondary">Cancelar</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="section-body">
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Nome da Empresa</th>
                                <th>CNPJ</th>
                                <th style={{ textAlign: 'center' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.map(company => (
                                <tr key={company.id}>
                                    <td>{company.name}</td>
                                    <td>{company.cnpj}</td>
                                    <td>
                                        <div className="actions-container">
                                            <button onClick={() => handleEdit(company)} className="action-button-icon" title="Editar">✏️</button>
                                            <button onClick={() => handleDelete(company.id)} className="action-button-icon danger" title="Deletar">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CompanyManager;