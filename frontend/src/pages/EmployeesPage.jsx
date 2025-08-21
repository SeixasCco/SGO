import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const EmployeesPage = () => {
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({ name: '', position: '', hireDate: new Date().toISOString().split('T')[0] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEmployees = () => {
        axios.get('http://localhost:5145/api/employees')
            .then(response => {
                setEmployees(response.data.length ? response.data : []);
                setLoading(false);
            })
            .catch(err => {
                setError('Falha ao carregar funcionários.');
                setLoading(false);
            });
    };

    const handleDelete = (employeeId) => {
        if (window.confirm("Tem certeza que deseja deletar este funcionário?")) {
            axios.delete(`http://localhost:5145/api/employees/${employeeId}`)
                .then(() => {
                    alert("Funcionário deletado com sucesso!");
                    fetchEmployees();
                })
                .catch(error => {
                    alert("Falha ao deletar o funcionário.");
                    console.error(error);
                });
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5145/api/employees', formData)
            .then(() => {
                alert('Funcionário cadastrado com sucesso!');
                setFormData({ name: '', position: '', hireDate: new Date().toISOString().split('T')[0] });
                fetchEmployees();
            })
            .catch(err => {
                alert('Erro ao cadastrar funcionário.');
            });
    };

    if (loading) return <p>Carregando...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h1>👥 Gestão de Funcionários</h1>

            <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
                <h3>Cadastrar Novo Funcionário</h3>
                <div style={{ marginBottom: '10px' }}>
                    <label>Nome: </label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Cargo: </label>
                    <input type="text" name="position" value={formData.position} onChange={handleChange} required />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Data de Contratação: </label>
                    <input type="date" name="hireDate" value={formData.hireDate} onChange={handleChange} required />
                </div>
                <button type="submit">Salvar Funcionário</button>
            </form>
            <h2>Funcionários Cadastrados</h2>
            <table border="1" style={{ width: '100%' }}>
                <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Cargo</th>
                      <th>Data de Contratação</th>
                      <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(emp => (
                        <tr key={emp.id}>
                            <td>{emp.name}</td>
                            <td>{emp.position}</td>
                            <td>{new Date(emp.hireDate).toLocaleDateString()}</td>
                            <td>
                                <Link to={`/employee/edit/${emp.id}`}>
                                    <button>✏️ Editar</button>
                                </Link>
                                <button onClick={() => handleDelete(emp.id)} style={{ marginLeft: '10px' }}>
                                    🗑️ Deletar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeesPage;