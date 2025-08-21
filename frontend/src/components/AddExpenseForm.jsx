import React, { useState } from 'react'; 
import axios from 'axios';
import Select from 'react-select/creatable';

const AddExpenseForm = ({ projectId, contractId, onExpenseAdded }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    costCenterName: '',
  });
  const [costCenterOptions, setCostCenterOptions] = useState([]);
  const [selectedCostCenter, setSelectedCostCenter] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5145/api/costcenters')
      .then(response => {
        const options = response.data.map(cc => ({ value: cc.name, label: cc.name }));
        setCostCenterOptions(options);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCostCenter) {
      setError('Por favor, selecione ou crie um centro de custo.');
      return;
    }

    const newExpense = {
      ...formData,
      amount: parseFloat(formData.amount),
      projectId: projectId,
      contractId: contractId,
      costCenterName: selectedCostCenter.value 
    };

    axios.post('http://localhost:5145/api/projectexpenses', newExpense)
      .then(response => {
        alert('Despesa lançada com sucesso!');
        setFormData({ description: '', amount: '', date: new Date().toISOString().split('T')[0], costCenterName: '' });
        onExpenseAdded(); 
      })
      .catch(err => {
        console.error("Erro ao lançar despesa:", err);
        setError('Falha ao lançar despesa. Verifique os dados.');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} /* ... */ >
      {/* ... (campos de Descrição, Valor, Data) ... */}

      <div style={{ marginBottom: '10px' }}>
        <label>Centro de Custo: </label>
        <Select
          isClearable
          isCreatable
          options={costCenterOptions}
          value={selectedCostCenter}
          onChange={(newValue) => setSelectedCostCenter(newValue)}
          placeholder="Selecione ou digite para criar..."
        />
      </div>

      {/* NOVO CAMPO DE UPLOAD DE ARQUIVO SERÁ ADICIONADO AQUI NO PRÓXIMO PASSO */}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Salvando...' : 'Salvar Despesa'}
      </button>
      {/* ... */}
    </form>
  );
};

export default AddExpenseForm;