import React from 'react';

const FormGroup = ({ label, children, helpText }) => {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {children}
      {helpText && <div className="form-help-text">{helpText}</div>}
    </div>
  );
};

export default FormGroup;