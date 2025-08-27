import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ to, children }) => (
    <div className="breadcrumb">
        <Link to={to} className="breadcrumb-link">
            {children}
        </Link>
    </div>
);

export default Breadcrumb;