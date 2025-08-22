import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {        
        axios.get('http://localhost:5145/api/dashboard/recent-activity')
            .then(response => {
                setRecentActivity(response.data || []);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao buscar atividades recentes:", error);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <h1>Painel de Controle</h1>
           
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
                <button style={{padding: '10px 20px'}} onClick={() => navigate('/projects')}>Ver Todas as Obras</button>
                <button style={{padding: '10px 20px'}} onClick={() => navigate('/employees')}>Gerenciar Funcionários</button>
            </div>
           
            <div>
                <h2>Atividade Recente</h2>
                {loading ? (
                    <p>Carregando atividades...</p>
                ) : (
                    <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{padding: '8px', textAlign: 'left'}}>Data</th>
                                <th style={{padding: '8px', textAlign: 'left'}}>Tipo</th>
                                <th style={{padding: '8px', textAlign: 'left'}}>Descrição</th>
                                <th style={{padding: '8px', textAlign: 'left'}}>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentActivity.length > 0 ? (
                                recentActivity.map((activity, index) => (
                                    <tr key={index}>
                                        <td style={{padding: '8px'}}>{new Date(activity.activityDate).toLocaleDateString()}</td>
                                        <td style={{padding: '8px'}}>{activity.activityType}</td>
                                        <td style={{padding: '8px'}}>                                           
                                            <Link to={`/project/${activity.relatedId}`}>{activity.description}</Link>
                                        </td>
                                        <td style={{padding: '8px'}}>
                                            {activity.amount ? `R$ ${activity.amount.toFixed(2)}` : '-'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{padding: '8px', textAlign: 'center'}}>Nenhuma atividade recente.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default HomePage;