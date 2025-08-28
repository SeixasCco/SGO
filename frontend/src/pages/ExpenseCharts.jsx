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
            const month = new Date(item.date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric', timeZone: 'UTC' });
            acc[month] = (acc[month] || 0) + item.amount;
            return acc;
        }, {});

        const monthData = Object.entries(byMonth)
            .map(([month, value]) => ({ month, value }))
            .sort((a, b) => {
                const dateA = new Date(`01 ${a.month.replace(' de ', ' ')}`);
                const dateB = new Date(`01 ${b.month.replace(' de ', ' ')}`);
                return dateA - dateB;
            });

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
            <div className="card">
                <h3 className="card-header">📊 {title}</h3>
                <div className="bar-chart-container">
                    {data.map((item, index) => (
                        <div key={index} className="bar-chart-row">
                            <div className="bar-chart-label">{item.name || item.month}</div>
                            <div className="bar-chart-bar-bg">
                                <div
                                    className="bar-chart-bar-fill"
                                    style={{
                                        width: `${(item.value / maxValue) * 100}%`,
                                        backgroundColor: color
                                    }}
                                >
                                    <span className="bar-chart-percentage">
                                        {((item.value / maxValue) * 100).toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                            <div className="bar-chart-value">{formatCurrency(item.value)}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const PieChart = ({ data, title }) => {
        if (!data || data.length === 0) return null;
        const total = data.reduce((sum, item) => sum + item.value, 0);
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

        return (
            <div className="card">
                <h3 className="card-header">🥧 {title}</h3>
                <div className="pie-chart-container">
                    {data.map((item, index) => {
                        const percentage = ((item.value / total) * 100).toFixed(1);
                        const color = colors[index % colors.length];
                        return (
                            <div key={index} className="pie-chart-item">
                                <div className="pie-chart-legend">
                                    <div className="pie-chart-color-dot" style={{ backgroundColor: color }}></div>
                                    <span className="pie-chart-name">{item.name}</span>
                                </div>
                                <div className="pie-chart-details">
                                    <div className="pie-chart-value">{formatCurrency(item.value)}</div>
                                    <div className="pie-chart-percentage">{percentage}%</div>
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
            <div className="card">
                <h3 className="card-header">📈 {title}</h3>
                <div className="timeline-chart-container">
                    <div className="timeline-chart-baseline"></div>
                    <div className="timeline-chart-bars">
                        {data.map((item, index) => {
                            const height = (item.value / maxValue) * 140;
                            const shortValue = item.value >= 1000 ? `${(item.value / 1000).toFixed(0)}k` : formatCurrency(item.value).replace('R$\xa0', '');
                            return (
                                <div key={index} className="timeline-item">
                                    <div className="timeline-bar" style={{ height: `${height}px` }}>
                                        <div className="timeline-value-label">R$ {shortValue}</div>
                                    </div>
                                    <div className="timeline-month-label">{item.month}</div>
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
        <div className="charts-grid-container">
            {chartData.byMonth.length > 0 && (
                <TimelineChart data={chartData.byMonth} title="Evolução Mensal de Gastos" />
            )}
            <div className="charts-grid-double">
                {chartData.byProject.length > 0 && (
                    <HorizontalBarChart data={chartData.byProject} title="Top Obras por Gastos" color="#10b981" />
                )}
                {chartData.byCostCenter.length > 0 && (
                    <PieChart data={chartData.byCostCenter} title="Distribuição por Centro de Custo" />
                )}
            </div>
        </div>
    );
};

export default ExpenseCharts;