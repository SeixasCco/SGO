import React from 'react';

const StatusBadge = ({ status }) => {
    const statusMap = {
        1: { text: 'Planejamento', class: 'status-planning' },
        2: { text: 'Ativa', class: 'status-active' },
        3: { text: 'Pausada', class: 'status-paused' },
        4: { text: 'Concluída', class: 'status-completed' },
        5: { text: 'Aditivo', class: 'status-additive' },
        6: { text: 'Cancelada', class: 'status-cancelled' }
    };
    
    const { text, class: className } = statusMap[status] || statusMap[2];
    
    return (
        <span className={`status-badge ${className}`}>
            {text}
        </span>
    );
};

export default StatusBadge;