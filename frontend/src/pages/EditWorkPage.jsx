import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompany } from '../context/CompanyContext'; 
import PageContainer from '../components/common/PageContainer';
import BreadCrumb from '../components/common/BreadCrumb';

const StyledInput = React.forwardRef((props, ref) => (
    <input className="form-input" ref={ref} {...props} />
));

const StyledSelect = React.forwardRef((props, ref) => (
    <select className="form-select" ref={ref} {...props} />
));

const StyledTextarea = React.forwardRef((props, ref) => (
    <textarea className="form-textarea" ref={ref} {...props} />
));


const EditWorkPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { companies } = useCompany(); 
    const [formData, setFormData] = useState({
        name: '',
        cnpj: '',
        cno: '',
        contractor: '',
        serviceTaker: '',
        responsible: '',
        city: '',
        state: '',
        status: 1,
        startDate: '',
        endDate: '',
        address: '',
        description: '',      
        companyId: '' 
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchWorkData = async () => {
            try {
                const response = await fetch(`/api/projects/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Falha ao buscar dados da obra');
                }
                const data = await response.json();                
              
                const formattedStartDate = data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '';
                const formattedEndDate = data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '';

                setFormData({
                    ...data,
                    startDate: formattedStartDate,
                    endDate: formattedEndDate
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const finalValue = e.target.type === 'select-one' ? parseInt(value, 10) : value;
        setFormData(prevState => ({
            ...prevState,
            [name]: finalValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.companyId) {
            setError("Por favor, selecione uma matriz.");
            return;
        }
        
        const dataToSend = {
            ...formData,
            id: id
        };

        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao atualizar a obra');
            }

            setSuccess('Obra atualizada com sucesso!');
            setTimeout(() => navigate(`/projects/${id}`), 2000);

        } catch (err) {
            setError(err.message);
        }
    };
    
    if (loading) return <PageContainer>Carregando...</PageContainer>;

    return (
        <PageContainer>
            <BreadCrumb
                items={[
                    { label: 'Obras', path: '/projects' },
                    { label: formData.name, path: `/projects/${id}` },
                    { label: 'Editar' }
                ]}
            />
            <h1 className="text-2xl font-bold mb-4">Editar Obra</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl mx-auto">
                {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
                {success && <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">{success}</div>}
               
                <div>
                    <label htmlFor="companyId" className="block text-sm font-medium text-gray-700">Matriz</label>
                    <StyledSelect
                        id="companyId"
                        name="companyId"
                        value={formData.companyId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione uma Matriz</option>
                        {companies.map(company => (
                            <option key={company.id} value={company.id}>
                                {company.name}
                            </option>
                        ))}
                    </StyledSelect>
                </div>              

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome da Obra</label>
                    <StyledInput type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">CNPJ</label>
                    <StyledInput type="text" id="cnpj" name="cnpj" value={formData.cnpj} onChange={handleChange} required />
                </div>                
                
                <div>
                    <label htmlFor="responsible" className="block text-sm font-medium text-gray-700">Responsável</label>
                    <StyledInput type="text" id="responsible" name="responsible" value={formData.responsible} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="contractor" className="block text-sm font-medium text-gray-700">Contratante</label>
                        <StyledInput type="text" id="contractor" name="contractor" value={formData.contractor} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="serviceTaker" className="block text-sm font-medium text-gray-700">Tomador de Serviço</label>
                        <StyledInput type="text" id="serviceTaker" name="serviceTaker" value={formData.serviceTaker} onChange={handleChange} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">Cidade</label>
                        <StyledInput type="text" id="city" name="city" value={formData.city} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">Estado</label>
                        <StyledInput type="text" id="state" name="state" value={formData.state} onChange={handleChange} />
                    </div>
                </div>
                 <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Endereço</label>
                    <StyledInput type="text" id="address" name="address" value={formData.address} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Data de Início</label>
                        <StyledInput type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Data de Fim</label>
                        <StyledInput type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} />
                    </div>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
                    <StyledTextarea id="description" name="description" value={formData.description} onChange={handleChange} rows="4" />
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Salvar Alterações
                </button>
            </form>
        </PageContainer>
    );
};

export default EditWorkPage;