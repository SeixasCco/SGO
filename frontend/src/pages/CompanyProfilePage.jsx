import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'; 

import FormGroup from '../components/common/FormGroup';
import StyledInput from '../components/common/StyledInput';

const CompanyProfilePage = () => {
    const [formData, setFormData] = useState({ id: null, name: '', cnpj: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5145/api/companies/main')
            .then(response => {
                if (response.data) {
                    setFormData({
                        id: response.data.id,
                        name: response.data.name,
                        cnpj: response.data.cnpj
                    });
                }
            })
            .catch(error => {
                console.log("Nenhuma empresa matriz encontrada. O formulário está pronto para o primeiro cadastro.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const apiCall = formData.id
            ? axios.put(`http://localhost:5145/api/companies/${formData.id}`, formData)
            : axios.post('http://localhost:5145/api/companies', { name: formData.name, cnpj: formData.cnpj });

        toast.promise(apiCall, {
            loading: 'Salvando dados da empresa...',
            success: 'Dados salvos com sucesso!',
            error: 'Falha ao salvar os dados.'
        });
    };
    
    if (loading) {
        return <div className="loading-state">Carregando...</div>;
    }

    return (       
        <div className="card" style={{ maxWidth: '700px' }}> 
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    <FormGroup label="Nome da Empresa (Matriz)">
                        <StyledInput
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>
                    
                    <FormGroup label="CNPJ da Matriz">
                        <StyledInput
                            type="text"
                            name="cnpj"
                            value={formData.cnpj}
                            onChange={handleChange}
                            required
                            placeholder="XX.XXX.XXX/XXXX-XX"
                        />
                    </FormGroup>
                
                </div>
                
                <button type="submit" className="form-button" style={{ marginTop: '24px' }}>
                    💾 Salvar Dados da Empresa
                </button>
            </form>
        </div>
    );
};

export default CompanyProfilePage;