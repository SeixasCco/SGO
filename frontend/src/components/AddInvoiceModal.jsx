import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddInvoiceModal = ({ contractId, onClose, onInvoiceAdded }) => {

  const [issueDate, setIssueDate] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [grossValue, setGrossValue] = useState('');
  const [issValue, setIssValue] = useState('');
  const [inssValue, setInssValue] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const calculateNetValue = () => {
    const gross = parseFloat(grossValue) || 0;
    const iss = parseFloat(issValue) || 0;
    const inss = parseFloat(inssValue) || 0;
    return gross - iss - inss;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!issueDate || !invoiceNumber || !grossValue || !paymentDate) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const netValue = calculateNetValue();
    if (netValue < 0) {
      toast.error('O valor líquido não pode ser negativo. Verifique os valores de ISS e INSS.');
      return;
    }

    setSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('issueDate', issueDate);
    formData.append('invoiceNumber', invoiceNumber);
    formData.append('grossValue', grossValue);
    formData.append('issValue', issValue || 0);
    formData.append('inssValue', inssValue || 0);
    formData.append('paymentDate', paymentDate);
    formData.append('contractId', contractId);
    formData.append('Status', 1);

    if (attachment) {
      formData.append('attachment', attachment);
    }

    axios.post('http://localhost:5145/api/contractinvoices', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      onInvoiceAdded(response.data);
      onClose();
    })
    .catch(err => {
      const errorMessage = err.response?.data?.message || 'Falha ao adicionar a nota fiscal. Tente novamente.';
      toast.error(errorMessage);
      setSubmitting(false);
    });
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={headerStyle}>📋 Nova Nota Fiscal</h2>

        <form onSubmit={handleSubmit}>

          {/* Seção superior - Informações da NF */}
          <div style={sectionStyle}>
            <h3 style={sectionHeaderStyle}>ℹ️ Dados da Nota Fiscal</h3>

            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>Data Emissão *</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={e => setIssueDate(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Número da NF *</label>
                <input
                  type="text"
                  placeholder="Ex: 123456"
                  value={invoiceNumber}
                  onChange={e => setInvoiceNumber(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Seção valores financeiros */}
          <div style={sectionStyle}>
            <h3 style={sectionHeaderStyle}>💰 Valores Financeiros</h3>

            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>Valor Bruto *</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={grossValue}
                  onChange={e => setGrossValue(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Valor ISS</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={issValue}
                  onChange={e => setIssValue(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Valor INSS</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={inssValue}
                  onChange={e => setInssValue(e.target.value)}
                  style={inputStyle}
                />
              </div>

              {/* Valor líquido calculado automaticamente */}
              <div>
                <label style={labelStyle}>Valor Líquido</label>
                <div style={{
                  ...inputStyle,
                  backgroundColor: '#f0f9ff',
                  color: '#0c4a6e',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  R$ {calculateNetValue().toFixed(2).replace('.', ',')}
                </div>
              </div>
            </div>
          </div>

          {/* Seção inferior - Pagamento e Anexo */}
          <div style={sectionStyle}>
            <h3 style={sectionHeaderStyle}>📅 Pagamento e Anexo</h3>

            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>Data Pagamento *</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={e => setPaymentDate(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Anexar Arquivo</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={fileInputStyle}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
              </div>
            </div>
          </div>

          {error && <p style={errorStyle}>{error}</p>}

          <div style={buttonContainerStyle}>
            <button type="button" onClick={onClose} style={buttonStyle.secondary}>
              Cancelar
            </button>
            <button type="submit" disabled={submitting} style={buttonStyle.primary}>
              {submitting ? 'Salvando...' : 'Salvar Nota Fiscal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Estilos
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalStyle = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '32px',
  width: '100%',
  maxWidth: '700px',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
};

const headerStyle = {
  marginTop: 0,
  marginBottom: '24px',
  color: '#1e293b',
  fontSize: '1.5rem',
  fontWeight: '600',
  textAlign: 'center'
};

const sectionStyle = {
  marginBottom: '24px',
  padding: '20px',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  border: '1px solid #e2e8f0'
};

const sectionHeaderStyle = {
  margin: '0 0 16px 0',
  color: '#475569',
  fontSize: '1rem',
  fontWeight: '600'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '16px'
};

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '0.9rem',
  fontWeight: '600',
  color: '#374151'
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '1rem',
  boxSizing: 'border-box',
  backgroundColor: 'white',
  color: '#1f2937',
  transition: 'border-color 0.2s ease'
};

const fileInputStyle = {
  ...inputStyle,
  backgroundColor: '#f9fafb'
};

const errorStyle = {
  color: '#b91c1c',
  marginTop: '16px',
  padding: '12px',
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '8px'
};

const buttonContainerStyle = {
  marginTop: '24px',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px'
};

const buttonStyle = {
  primary: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  secondary: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  }
};

export default AddInvoiceModal;
