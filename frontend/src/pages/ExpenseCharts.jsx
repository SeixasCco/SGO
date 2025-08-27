import React from 'react';

const ExpenseCharts = ({ reportData, summary }) => {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    };

    const prepareChartData = () => {
        if (!reportData || reportData.length === 0) return { byProject: [], byMonth: [], byCostCenter: [] };
        const byProject = Object.entries(summary.byProject || {})
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6);

        const byMonth = reportData.reduce((acc, item) => {
            const month = new Date(item.date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
            acc[month] = (acc[month] || 0) + item.amount;
            return acc;
        }, {});

        const monthData = Object.entries(byMonth)
            .map(([month, value]) => ({ month, value }))
            .sort((a, b) => new Date('01 ' + a.month) - new Date('01 ' + b.month));

        const byCostCenter = reportData.reduce((acc, item) => {
            const center = item.costCenterName || 'Sem Centro de Custo';
            acc[center] = (acc[center] || 0) + item.amount;
            return acc;
        }, {});

        const costCenterData = Object.entries(byCostCenter)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        return { byProject, byMonth: monthData, byCostCenter: costCenterData };
    };

    const chartData = prepareChartData();

    const HorizontalBarChart = ({ data, title, color }) => {
        if (!data || data.length === 0) return null;

        const maxValue = Math.max(...data.map(item => item.value));

        return (
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e2e8f0'
            }}>
                <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    color: '#1e293b',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    📊 {title}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {data.map((item, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                minWidth: '140px',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                color: '#374151'
                            }}>
                                {item.name || item.month}
                            </div>

                            <div style={{ flex: 1, position: 'relative' }}>
                                <div style={{
                                    height: '24px',
                                    backgroundColor: '#f1f5f9',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${(item.value / maxValue) * 100}%`,
                                        background: `linear-gradient(90deg, ${color}, ${color}dd)`,
                                        borderRadius: '12px',
                                        transition: 'width 1s ease-out',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        paddingRight: '8px'
                                    }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            color: 'white',
                                            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                        }}>
                                            {((item.value / maxValue) * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                minWidth: '100px',
                                textAlign: 'right',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: '#059669'
                            }}>
                                {formatCurrency(item.value)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };


    const PieChart = ({ data, title }) => {
        if (!data || data.length === 0) return null;

        const total = data.reduce((sum, item) => sum + item.value, 0);
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

        return (
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e2e8f0'
            }}>
                <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    color: '#1e293b',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    🥧 {title}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {data.map((item, index) => {
                        const percentage = ((item.value / total) * 100).toFixed(1);
                        const color = colors[index % colors.length];

                        return (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '12px',
                                backgroundColor: '#fafbfc',
                                borderRadius: '8px',
                                border: '1px solid #f1f5f9'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        backgroundColor: color
                                    }}></div>
                                    <span style={{
                                        fontSize: '0.9rem',
                                        fontWeight: '500',
                                        color: '#374151'
                                    }}>
                                        {item.name}
                                    </span>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        color: '#059669'
                                    }}>
                                        {formatCurrency(item.value)}
                                    </div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        color: '#64748b'
                                    }}>
                                        {percentage}%
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const TimelineChart = ({ data, title }) => {
        if (!data || data.length === 0) return null;

        const maxValue = Math.max(...data.map(item => item.value));

        return (
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e2e8f0'
            }}>
                <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    color: '#1e293b',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    📈 {title}
                </h3>

                <div style={{ position: 'relative', height: '200px', padding: '20px 0' }}>
                    {/* Linha base */}
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '0',
                        right: '0',
                        height: '2px',
                        backgroundColor: '#e2e8f0'
                    }}></div>

                    {/* Pontos e barras */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'end',
                        height: '100%',
                        gap: '8px'
                    }}>
                        {data.map((item, index) => {
                            const height = (item.value / maxValue) * 140;
                            const shortValue = item.value >= 1000
                                ? `${(item.value / 1000).toFixed(0)}k`
                                : formatCurrency(item.value).replace('R$ ', '');

                            return (
                                <div key={index} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    flex: 1,
                                    gap: '8px'
                                }}>
                                    {/* Barra */}
                                    <div style={{
                                        width: '100%',
                                        maxWidth: '40px',
                                        height: `${height}px`,
                                        backgroundColor: '#3b82f6',
                                        borderRadius: '4px 4px 0 0',
                                        position: 'relative',
                                        transition: 'height 1s ease-out'
                                    }}>
                                        {/* Valor no topo */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '-25px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            fontSize: '0.7rem',
                                            fontWeight: '600',
                                            color: '#3b82f6',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            R$ {shortValue}
                                        </div>
                                    </div>

                                    {/* Label do mês */}
                                    <div style={{
                                        fontSize: '0.75rem',
                                        color: '#64748b',
                                        fontWeight: '500',
                                        textAlign: 'center',
                                        transform: 'rotate(-45deg)',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {item.month}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    if (!reportData || reportData.length === 0) {
        return null;
    }

    return (
        <div style={{
            display: 'grid',
            gap: '24px',
            marginTop: '32px'
        }}>
            {/* Linha 1: Timeline de gastos mensais */}
            {chartData.byMonth.length > 0 && (
                <TimelineChart
                    data={chartData.byMonth}
                    title="Evolução Mensal de Gastos"
                />
            )}

            {/* Linha 2: Top projetos e Centro de custo */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '24px'
            }}>
                {chartData.byProject.length > 0 && (
                    <HorizontalBarChart
                        data={chartData.byProject}
                        title="Top Obras por Gastos"
                        color="#10b981"
                    />
                )}

                {chartData.byCostCenter.length > 0 && (
                    <PieChart
                        data={chartData.byCostCenter}
                        title="Distribuição por Centro de Custo"
                    />
                )}
            </div>
        </div>
    );
};

export default ExpenseCharts;
