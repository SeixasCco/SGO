import React from 'react';

const SectionContainer = ({ 
    title, 
    children, 
    headerAction, 
    count 
}) => (
    <div className="section-container">
        <div className="section-header">
            <h2 className="section-title">
                {title}
                {count !== undefined && (
                    <span className="count-badge">{count}</span>
                )}
            </h2>
            {headerAction}
        </div>
        <div className="section-body">
            {children}
        </div>
    </div>
);

export default SectionContainer;