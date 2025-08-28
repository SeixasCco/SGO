import React from 'react';

const SummaryCard = ({ title, value, icon, color }) => {
    return (
        <div className="summary-card">
            <div className={`summary-card-icon ${color}`}>
                {icon}
            </div>
            <div className="summary-card-value">{value}</div>
            <div className="summary-card-label">{title}</div>
        </div>
    );
};

export default SummaryCard;