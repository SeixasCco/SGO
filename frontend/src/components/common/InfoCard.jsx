
import React from 'react';

const InfoCard = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    colorClass = 'info-card-blue' 
}) => (
    <div className={`info-card ${colorClass}`}>
        <div className="info-card-header">
            {icon && <span className="info-card-icon">{icon}</span>}
            <div className="info-card-title">{title}</div>
        </div>
        <div className="info-card-value">{value}</div>
        {subtitle && <div className="info-card-subtitle">{subtitle}</div>}
    </div>
);

export default InfoCard;