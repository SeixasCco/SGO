import React, { useState } from 'react';
import axios from 'axios';

const AddExpenseForm = ({ projectId, contractId, onExpenseAdded }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    costCenterId: '',
    numberOfPeople: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
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
        console.error("Erro no upload do arquivo:", err);
        setError('Falha ao enviar o anexo. Tente novamente.');
        setSubmitting(false);
        return;
      }
    }

    const newExpense = {
      ...formData,
      amount: parseFloat(formData.amount),
      costCenterId: formData.costCenterId,
      numberOfPeople: formData.numberOfPeople ? parseInt(formData.numberOfPeople, 10) : null,
      projectId: projectId,
      contractId: contractId,
      attachmentPath: attachmentPath,
    };

    delete newExpense.costCenterName;

    try {
      await axios.post('http://localhost:5145/api/projectexpenses', newExpense);
      alert('Despesa lançada com sucesso!');
      setFormData({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        costCenterId: '',
        numberOfPeople: ''
      });
      setSelectedFile(null);
      if (document.querySelector('input[type="file"]')) {
        document.querySelector('input[type="file"]').value = '';
      }
      onExpenseAdded();
    } catch (err) {
      console.error("Erro ao lançar despesa:", err);
      setError('Falha ao lançar despesa. Verifique os dados.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '32px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      marginTop: '20px'
    }}>

      {/* Header do Formulário */}
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        💸 Lançar Nova Despesa
      </h3>

      <form onSubmit={handleSubmit}>

        {/* Grid de Campos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '24px'
        }}>

          {/* Descrição */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Descrição da Despesa
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: '#dcdedfff',
                color: '#1f2937',
                fontWeight: '600',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              placeholder="Ex: Cimento Portland, Mão de obra, Material elétrico..."
            />
          </div>

          {/* Valor */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Valor (R$)
            </label>
            <input
              type="number"
              step="0.01"
              name="amount"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: '#dcdedfff',
                color: '#1f2937',
                fontWeight: '600',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              placeholder="0.00"
            />
            <div style={{
              fontSize: '0.875rem',
              color: '#64748b',
              marginTop: '4px'
            }}>
              💰 Use ponto (.) para decimais: 1234.56
            </div>
          </div>

          {/* Data */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Data da Despesa
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: '#dcdedfff',
                color: '#1f2937',
                fontWeight: '600',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            <div style={{
              fontSize: '0.875rem',
              color: '#64748b',
              marginTop: '4px'
            }}>
              📅 Data em que a despesa foi realizada
            </div>
          </div>

          {/* Centro de Custo */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Centro de Custo
            </label>
            <select
              name="costCenterId"
              value={formData.costCenterId}
              onChange={handleChange}
              required
              disabled={loadingCostCenters}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: '#dcdedfff',
                color: '#1f2937',
                fontWeight: '600',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease',                
                cursor: loadingCostCenters ? 'not-allowed' : 'pointer'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            >              
              <option value="">
                {loadingCostCenters ? 'Carregando...' : 'Selecione um centro de custo'}
              </option>
              {costCenters.map(cc => (
                <option key={cc.id} value={cc.id}>
                  {cc.name}
                </option>
              ))}              
            </select>
            <div style={{
              fontSize: '0.875rem',
              color: '#64748b',
              marginTop: '4px'
            }}>
              🏷️ Categoria para organização da despesa
            </div>
          </div>

          {/* Número de Pessoas */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Nº de Pessoas (Opcional)
            </label>
            <input
              type="number"
              name="numberOfPeople"
              value={formData.numberOfPeople}
              min="0"
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: '#dcdedfff',
                color: '#1f2937',
                fontWeight: '600',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              placeholder="0"
            />
            <div style={{
              fontSize: '0.875rem',
              color: '#64748b',
              marginTop: '4px'
            }}>
              👥 Para despesas relacionadas à equipe
            </div>
          </div>

          {/* Anexo */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Anexo (Nota Fiscal)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: '#dcdedfff',
                color: '#1f2937',
                fontWeight: '600',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
            />
            <div style={{
              fontSize: '0.875rem',
              color: '#64748b',
              marginTop: '4px'
            }}>
              📎 PDF, Imagens ou Documentos (opcional)
            </div>
          </div>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px'
          }}>
            <p style={{
              color: '#b91c1c',
              margin: '0',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              ❌ {error}
            </p>
          </div>
        )}

        {/* Arquivo Selecionado */}
        {selectedFile && (
          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px'
          }}>
            <p style={{
              color: '#1e40af',
              margin: '0',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              📎 Arquivo selecionado: {selectedFile.name}
            </p>
          </div>
        )}

        {/* Botão de Envio */}
        <button
          type="submit"
          disabled={submitting}
          style={{
            backgroundColor: submitting ? '#9ca3af' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '14px 32px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: submitting ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: submitting ? 'none' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}
          onMouseEnter={(e) => {
            if (!submitting) e.target.style.backgroundColor = '#059669';
          }}
          onMouseLeave={(e) => {
            if (!submitting) e.target.style.backgroundColor = '#10b981';
          }}
        >
          {submitting ? (
            <>
              ⏳ Salvando Despesa...
            </>
          ) : (
            <>
              💾 Salvar Despesa
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddExpenseForm;