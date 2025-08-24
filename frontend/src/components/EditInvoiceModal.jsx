import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditInvoiceModal = ({ invoice, onClose, onInvoiceUpdated }) => {
  const [title, setTitle] = useState('');
  const [grossValue, setGrossValue] = useState('');
  const [deductionsValue, setDeductionsValue] = useState('');
  const [depositDate, setDepositDate] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (invoice) {
      setTitle(invoice.title);
      setGrossValue(invoice.grossValue);
      setDeductionsValue(invoice.deductionsValue);    
      setDepositDate(new Date(invoice.depositDate).toISOString().split('T')[0]);
    }
  }, [invoice]);

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('grossValue', grossValue);
    formData.append('deductionsValue', deductionsValue || 0);
    formData.append('depositDate', depositDate);
    formData.append('contractId', invoice.contractId); 
    if (attachment) {
      formData.append('attachment', attachment); 
    }

    axios.put(`http://localhost:5145/api/contractinvoices/${invoice.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(() => {     
      const updatedInvoice = { ...invoice, title, grossValue, deductionsValue, depositDate };
      onInvoiceUpdated(updatedInvoice);
      onClose();
    })
    .catch(err => {
      setError('Falha ao atualizar a nota fiscal. Tente novamente.');
      console.error("Erro ao atualizar nota fiscal:", err);
      setSubmitting(false);
    });
  };

  return (
    <div style={{ /* Estilos do Overlay (igual ao AddInvoiceModal) */ }}>
      <div style={{ /* Estilos do Conteúdo do Modal (igual ao AddInvoiceModal) */ }}>
        <h2 style={{ marginTop: 0, marginBottom: '24px', color: '#1e293b' }}>Editar Nota Fiscal</h2>
        
        <form onSubmit={handleSubmit}>
          {/* O formulário é idêntico ao de Adicionar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input type="text" placeholder="Título da Nota" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <input type="number" step="0.01" placeholder="Valor Bruto *" value={grossValue} onChange={e => setGrossValue(e.target.value)} required style={inputStyle} />
              <input type="number" step="0.01" placeholder="Valor Deduções" value={deductionsValue} onChange={e => setDeductionsValue(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <input type="date" value={depositDate} onChange={e => setDepositDate(e.target.value)} required style={inputStyle} />
              <input type="file" onChange={handleFileChange} style={inputStyle} />
            </div>
            <small style={{color: '#64748b'}}>Anexo atual: {invoice.attachmentPath || 'Nenhum'}. Envie um novo arquivo para substituir.</small>
          </div>
          
          {error && <p style={{ color: '#b91c1c', marginTop: '16px' }}>{error}</p>}

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} style={buttonStyle.secondary}>Cancelar</button>
            <button type="submit" disabled={submitting} style={buttonStyle.primary}>
              {submitting ? 'Salvando...' : 'Salvar Alterações'}
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
    backgroundColor: '#16a34a', 
    color: 'white', border: 'none', borderRadius: '8px',
    padding: '12px 24px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer'
  },
  secondary: {
    backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px',
    padding: '12px 24px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer'
  }
};

export default EditInvoiceModal;