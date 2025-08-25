import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CompanyProfilePage = () => {
    const [formData, setFormData] = useState({ id: null, name: '', cnpj: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {        
        axios.get('http://localhost:5145/api/companies/main')
            .then(response => {
                setFormData({
                    id: response.data.id,
                    name: response.data.name,
                    cnpj: response.data.cnpj
                });
            })
            .catch(error => {                
                console.log("Nenhuma empresa cadastrada ainda. Pronto para criar a primeira.");
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
        const promise = axios.post('http://localhost:5145/api/companies', {
            name: formData.name,
            cnpj: formData.cnpj
        });

        toast.promise(promise, {
            loading: 'Salvando dados da empresa...',
            success: 'Dados salvos com sucesso!',
            error: 'Falha ao salvar os dados.'
        });
    };
    
    if (loading) {
        return <p>Carregando...</p>;
    }

    return (
        <div style={{ maxWidth: '700px' }}>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label>Nome da Empresa (Matriz)</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '12px', borderRadius: '8px',  backgroundColor: '#dcdedfff', color: '#1f2937',border: '1px solid #ccc', marginTop: '4px' }}
                        />
                    </div>
                    <div>
                        <label>CNPJ da Matriz</label>
                        <input
                            type="text"
                            name="cnpj"
                            value={formData.cnpj}
                            onChange={handleChange}
                            required
                            placeholder="XX.XXX.XXX/XXXX-XX"
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#dcdedfff', color: '#1f2937',border: '1px solid #ccc', marginTop: '4px' }}
                        />
                    </div>
                </div>
                <button type="submit" style={{ marginTop: '24px', padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    Salvar Dados da Empresa
                </button>
            </form>
        </div>
    );
};

export default CompanyProfilePage;