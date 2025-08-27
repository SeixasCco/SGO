import React from 'react';

const LoadingState = ({ message = "Carregando..." }) => (
    <div className="loading-state">
        {message}
    </div>
);

export default LoadingState;
