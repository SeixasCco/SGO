// Local: frontend/src/components/AddInvoiceModal.jsx

import React, { useState } from 'react';
import axios from 'axios';

const AddInvoiceModal = ({ contractId, onClose, onInvoiceAdded }) => {
  const [title, setTitle] = useState('');
  const [grossValue, setGrossValue] = useState('');
  const [deductionsValue, setDeductionsValue] = useState('');
  const [depositDate, setDepositDate] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !grossValue || !depositDate) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    setSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('grossValue', grossValue);
    formData.append('deductionsValue', deductionsValue || 0);
    formData.append('depositDate', depositDate);
    formData.append('contractId', contractId);
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
      setError('Falha ao adicionar a nota fiscal. Tente novamente.');
      console.error("Erro ao criar nota fiscal:", err);
      setSubmitting(false);
    });
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '12px', padding: '32px',
        width: '100%', maxWidth: '600px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '24px', color: '#1e293b' }}>Adicionar Nova Nota Fiscal</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input type="text" placeholder="Título da Nota (Ex: Medição 1)" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <input type="number" step="0.01" placeholder="Valor Bruto *" value={grossValue} onChange={e => setGrossValue(e.target.value)} required style={inputStyle} />
              <input type="number" step="0.01" placeholder="Valor Deduções" value={deductionsValue} onChange={e => setDeductionsValue(e.target.value)} style={inputStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <input type="date" value={depositDate} onChange={e => setDepositDate(e.target.value)} required style={inputStyle} />
              <input type="file" onChange={handleFileChange} style={inputStyle} />
            </div>
          </div>
          
          {error && <p style={{ color: '#b91c1c', marginTop: '16px' }}>{error}</p>}

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} style={buttonStyle.secondary}>Cancelar</button>
            <button type="submit" disabled={submitting} style={buttonStyle.primary}>
              {submitting ? 'Salvando...' : 'Salvar Nota Fiscal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
    width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
    borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box',
    backgroundColor: '#dcdedfff', 
    color: '#1f2937',        
};

const buttonStyle = {
  primary: {
    backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px',
    padding: '12px 24px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer'
  },
  secondary: {
    backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px',
    padding: '12px 24px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer'
  }
};

export default AddInvoiceModal;