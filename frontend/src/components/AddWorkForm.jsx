import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import FormGroup from './common/FormGroup';
import StyledInput from './common/StyledInput';

const StyledTextarea = (props) => (
    <textarea className="form-textarea" {...props} />
);

const AddWorkForm = ({ onWorkAdded }) => {
    const [formData, setFormData] = useState({
        cno: '',
        cnpj: '',
        name: '',
        contractor: '',
        serviceTaker: '',
        responsible: '',
        city: '',
        state: '',
        address: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const projectDto = { ...formData, endDate: formData.endDate || null };

        const promise = axios.post('http://localhost:5145/api/projects', projectDto);

        toast.promise(promise, {
            loading: 'Cadastrando nova obra...',
            success: () => {
                setFormData({
                    cno: '', cnpj: '', name: '', contractor: '', serviceTaker: '',
                    responsible: '', city: '', state: '', address: '',
                    description: '', startDate: new Date().toISOString().split('T')[0], endDate: '',
                });
                if (onWorkAdded) onWorkAdded();
                return 'Obra cadastrada com sucesso!';
            },
            error: 'Falha ao cadastrar obra. Verifique os dados.'
        }).finally(() => setSubmitting(false));
    };

    return (
        <div className="card">
            <h3 className="card-header">🏗️ Cadastrar Nova Obra</h3>
            <form onSubmit={handleSubmit}>
                <h3 className="section-divider">📋 Informações Básicas</h3>
                <div className="form-grid">
                    <FormGroup label="CNPJ">
                        <StyledInput type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} required placeholder="XX.XXX.XXX/XXXX-XX" />
                    </FormGroup>
                    <FormGroup label="CNO">
                        <StyledInput type="text" name="cno" value={formData.cno} onChange={handleChange} placeholder="Cadastro Nacional de Obras" />
                    </FormGroup>
                    <FormGroup label="Nome da Obra *">
                        <StyledInput type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ex: Construção Residencial" />
                    </FormGroup>
                    <FormGroup label="Contratante *">
                        <StyledInput type="text" name="contractor" value={formData.contractor} onChange={handleChange} required placeholder="Nome da empresa contratante" />
                    </FormGroup>
                    <FormGroup label="Tomador do Serviço *">
                        <StyledInput type="text" name="serviceTaker" value={formData.serviceTaker} onChange={handleChange} required placeholder="Quem irá utilizar o serviço" />
                    </FormGroup>
                    <FormGroup label="Responsável *">
                        <StyledInput type="text" name="responsible" value={formData.responsible} onChange={handleChange} required placeholder="Responsável técnico da obra" />
                    </FormGroup>
                </div>

                <h3 className="section-divider">📍 Localização</h3>
                <div className="form-grid">
                     <FormGroup label="Cidade *">
                        <StyledInput type="text" name="city" value={formData.city} onChange={handleChange} required placeholder="Cidade da obra" />
                    </FormGroup>
                     <FormGroup label="Estado *">
                        <StyledInput type="text" name="state" value={formData.state} onChange={handleChange} maxLength="2" required placeholder="UF" />
                    </FormGroup>
                    <div style={{gridColumn: '1 / -1'}}>
                        <FormGroup label="Endereço">
                            <StyledInput type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Endereço completo (opcional)" />
                        </FormGroup>
                    </div>
                </div>

                <h3 className="section-divider">📅 Cronograma</h3>
                <div className="form-grid">
                    <FormGroup label="Data Início *">
                        <StyledInput type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                    </FormGroup>
                    <FormGroup label="Data Fim">
                        <StyledInput type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                    </FormGroup>
                </div>
                
                <h3 className="section-divider">📝 Descrição</h3>
                <FormGroup label="Descrição">
                    <StyledTextarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Descrição detalhada da obra (opcional)"
                    />
                </FormGroup>

                <div className="modal-footer" style={{marginTop: '32px'}}>
                    <button type="submit" disabled={submitting} className="form-button">
                        {submitting ? '⏳ Salvando...' : '💾 Salvar Obra'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddWorkForm;