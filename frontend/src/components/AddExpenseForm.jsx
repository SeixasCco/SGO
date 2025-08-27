import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import FormGroup from '../common/FormGroup';
import StyledInput from '../common/StyledInput';

const StyledButton = ({ children, submitting, ...props }) => (
  <button type="submit" disabled={submitting} className="form-button" {...props}>
    {submitting ? '⏳ Salvando...' : children}
  </button>
);

const AddExpenseForm = ({ projectId, contractId, onExpenseAdded }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    costCenterId: '',
  });
  const [costCenters, setCostCenters] = useState([]);
  const [loadingCostCenters, setLoadingCostCenters] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {    
    const fetchCostCenters = async () => {
      try {
        const response = await axios.get('http://localhost:5145/api/costcenters');
        setCostCenters(response.data);
      } catch (error) {
        console.error('Erro ao buscar centros de custo:', error);
        toast.error('Não foi possível carregar os centros de custo.');
      } finally {
        setLoadingCostCenters(false);
      }
    };
    fetchCostCenters();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    let attachmentPath = null;
    if (selectedFile) {
      const uploadData = new FormData();
      uploadData.append('file', selectedFile);
      try {
        const uploadResponse = await axios.post('http://localhost:5145/api/attachments/upload', uploadData);
        attachmentPath = uploadResponse.data.filePath;
      } catch (err) {
        setError('Falha ao enviar o anexo. Tente novamente.');
        setSubmitting(false);
        return;
      }
    }

    const newExpense = {
      ...formData,
      amount: parseFloat(formData.amount),
      projectId: projectId,
      contractId: contractId,
      attachmentPath: attachmentPath,
    };

    try {
      await axios.post('http://localhost:5145/api/projectexpenses', newExpense);
      toast.success('Despesa lançada com sucesso!');      
      setFormData({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        costCenterId: '',
      });
      setSelectedFile(null);
      if (document.querySelector('input[type="file"]')) {
        document.querySelector('input[type="file"]').value = '';
      }
      onExpenseAdded();
    } catch (err) {
      setError('Falha ao lançar despesa. Verifique os dados.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h3 className="form-header">💸 Lançar Nova Despesa</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Descrição */}
          <div style={{ gridColumn: '1 / -1' }}>
            <FormGroup label="Descrição da Despesa">
              <StyledInput
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Ex: Cimento Portland, Mão de obra..."
              />
            </FormGroup>
          </div>

          {/* Valor */}
          <FormGroup label="Valor (R$)" helpText="💰 Use ponto (.) para decimais: 1234.56">
            <StyledInput
              type="number"
              step="0.01"
              name="amount"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              required
              placeholder="0.00"
            />
          </FormGroup>

          {/* Data */}
          <FormGroup label="Data da Despesa" helpText="📅 Data em que a despesa foi realizada">
            <StyledInput
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </FormGroup>

          {/* Centro de Custo */}
          <FormGroup label="Centro de Custo" helpText="🏷️ Categoria para organização da despesa">
            <select
              name="costCenterId"
              value={formData.costCenterId}
              onChange={handleChange}
              required
              disabled={loadingCostCenters}
              className="form-select" 
            >
              <option value="">
                {loadingCostCenters ? 'Carregando...' : 'Selecione um centro de custo'}
              </option>
              {costCenters.map((cc) => (
                <option key={cc.id} value={cc.id}>
                  {cc.name}
                </option>
              ))}
            </select>
          </FormGroup>

          {/* Anexo */}
          <FormGroup label="Anexo (Nota Fiscal)" helpText="📎 PDF, Imagens ou Documentos (opcional)">
            <StyledInput
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
            />
          </FormGroup>
        </div>

        {/* Mensagem de Erro e Arquivo Selecionado */}
        {error && <div className="form-error-message">❌ {error}</div>}
        {selectedFile && <div className="form-info-message">📎 Arquivo selecionado: {selectedFile.name}</div>}

        {/* Botão de Envio */}
        <StyledButton submitting={submitting}>
            💾 Salvar Despesa
        </StyledButton>
      </form>
    </div>
  );
};

export default AddExpenseForm;