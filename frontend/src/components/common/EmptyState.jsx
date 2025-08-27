
import React from 'react';

const EmptyState = ({ 
    icon, 
    title, 
    message, 
    action 
}) => (
    <div className="empty-state">
        <div className="empty-state-icon">{icon}</div>
        {title && <h3 className="empty-state-title">{title}</h3>}
        <div className="empty-state-message">{message}</div>
        {action}
    </div>
);

export default EmptyState;

