import React, { useState } from 'react'; 

const AddWorkForm = ({ onWorkAdded }) => {
  const [formData, setFormData] = useState({
    cno: '',
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
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const projectDto = {
      cno: formData.cno,
      name: formData.name,
      contractor: formData.contractor,
      serviceTaker: formData.serviceTaker,
      responsible: formData.responsible,
      city: formData.city,
      state: formData.state,
      address: formData.address,
      description: formData.description,
      startDate: formData.startDate,     
      endDate: formData.endDate || null, 
    };

    fetch('http://localhost:5145/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectDto)
    })
      .then(response => {
        if (response.ok) {
          alert('Obra cadastrada com sucesso!');         
          setFormData({ 
            cno: '',
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
          if (onWorkAdded) onWorkAdded(); 
        } else {
          throw new Error('Erro na resposta do servidor');
        }
      })
      .catch(err => {
        console.error("Erro ao cadastrar obra:", err);
        setError('Falha ao cadastrar obra. Tente novamente.');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const containerStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '30px',
    borderRadius: '16px',
    margin: '20px 0',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
  };

  const headerStyle = {
    color: 'white',
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '25px',
    textAlign: 'center',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '25px',
  };

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const labelStyle = {
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
  };

  const inputStyle = {
    backgroundColor: '#dcdedfff',
    color: '#1f2937',
    border: '2px solid transparent',
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '500',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  };

  const inputFocusStyle = {
    ...inputStyle,
    borderColor: '#4f46e5',
    boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)',
    transform: 'translateY(-1px)',
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '80px',
    resize: 'vertical',
    fontFamily: 'inherit',
  };

  const buttonStyle = {
    background: submitting 
      ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
      : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '14px 28px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: submitting ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)',
    width: '100%',
    marginTop: '10px',
  };

  const errorStyle = {
    background: 'rgba(239, 68, 68, 0.9)',
    color: 'white',
    padding: '12px 16px',
    borderRadius: '8px',
    marginTop: '15px',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
  };

  return (
    <div style={containerStyle}>
      <h3 style={headerStyle}>🏗️ Cadastrar Nova Obra</h3>
      
      <div style={gridStyle}>
        {/* ✅ CNO */}
        <div style={fieldStyle}>
          <label style={labelStyle}>CNO *</label>
          <input 
            type="text" 
            name="cno" 
            value={formData.cno} 
            onChange={handleChange} 
            required
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            placeholder="Cadastro Nacional de Obras"
          />
        </div>
        
        {/*  Nome da Obra */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Nome da Obra *</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            placeholder="Ex: Construção Residencial"
          />
        </div>
        
        {/*  Contratante */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Contratante *</label>
          <input 
            type="text" 
            name="contractor" 
            value={formData.contractor} 
            onChange={handleChange} 
            required
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            placeholder="Nome da empresa contratante"
          />
        </div>
        
        {/*  Tomador do Serviço */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Tomador do Serviço *</label>
          <input 
            type="text" 
            name="serviceTaker" 
            value={formData.serviceTaker} 
            onChange={handleChange} 
            required
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            placeholder="Quem irá utilizar o serviço"
          />
        </div>
        
        {/*  Responsável */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Responsável *</label>
          <input 
            type="text" 
            name="responsible" 
            value={formData.responsible} 
            onChange={handleChange} 
            required
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            placeholder="Responsável técnico da obra"
          />
        </div>
        
        {/* Cidade */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Cidade *</label>
          <input 
            type="text" 
            name="city" 
            value={formData.city} 
            onChange={handleChange} 
            required
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            placeholder="Cidade da obra"
          />
        </div>
        
        {/* Estado */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Estado *</label>
          <input 
            type="text" 
            name="state" 
            value={formData.state} 
            onChange={handleChange} 
            maxLength="2" 
            required
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            placeholder="UF"
          />
        </div>
        
        {/* Endereço */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Endereço</label>
          <input 
            type="text" 
            name="address" 
            value={formData.address} 
            onChange={handleChange}
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            placeholder="Endereço completo (opcional)"
          />
        </div>
        
        {/* Data Início */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Data Início *</label>
          <input 
            type="date" 
            name="startDate" 
            value={formData.startDate} 
            onChange={handleChange} 
            required
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
          />
        </div>
        
        {/* Data Fim */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Data Fim</label>
          <input 
            type="date" 
            name="endDate" 
            value={formData.endDate} 
            onChange={handleChange}
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
          />
        </div>
      </div>
      
      {/*  Descrição  */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Descrição</label>
        <textarea 
          name="description" 
          value={formData.description} 
          onChange={handleChange}
          style={textareaStyle}
          onFocus={(e) => Object.assign(e.target.style, {...textareaStyle, borderColor: '#4f46e5', boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)'})}
          onBlur={(e) => Object.assign(e.target.style, textareaStyle)}
          placeholder="Descrição detalhada da obra (opcional)"
        />
      </div>
      
      <button 
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        style={buttonStyle}
        onMouseEnter={(e) => {
          if (!submitting) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!submitting) {
            e.target.style.transform = 'translateY(0px)';
            e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.3)';
          }
        }}
      >
        {submitting ? '⏳ Salvando...' : '💾 Salvar Obra'}
      </button>
      
      {error && <div style={errorStyle}>⚠️ {error}</div>}
    </div>
  );
};

export default AddWorkForm;