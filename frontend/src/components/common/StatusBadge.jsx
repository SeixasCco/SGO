import React from 'react';

const StatusBadge = ({ status, textOverride }) => {    
    const numericStatusMap = {
        1: { text: 'Planejamento', class: 'status-planning' },
        2: { text: 'Ativa', class: 'status-active' },
        3: { text: 'Pausada', class: 'status-paused' },
        4: { text: 'Concluída', class: 'status-completed' },
        5: { text: 'Aditivo', class: 'status-additive' },
        6: { text: 'Cancelada', class: 'status-cancelled' }
    };
   
    const stringStatusMap = {
        'active': { text: 'Ativo', class: 'status-active' },
        'inactive': { text: 'Inativo', class: 'status-inactive' } 
    };

    let statusInfo;
   
    if (typeof status === 'number') {
        statusInfo = numericStatusMap[status] || numericStatusMap[2]; 
    } else if (typeof status === 'string') {
        statusInfo = stringStatusMap[status] || { text: 'Desconhecido', class: 'status-additive' };
    } else {
        statusInfo = { text: 'Desconhecido', class: 'status-additive' };
    }
        
    if (textOverride && textOverride[status]) {
        statusInfo.text = textOverride[status];
    }

    return (
        <span className={`status-badge ${statusInfo.class}`}>
            {statusInfo.text}
        </span>
    );
};

export default StatusBadge;