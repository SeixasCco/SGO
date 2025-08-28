import React from 'react';
import { Link } from 'react-router-dom';

const ExpenseRow = ({ expense, onDelete, formatCurrency }) => (
    <div className="expense-row">
        <div className="expense-info">
            <div className="expense-description">{expense.description}</div>
            <div className="expense-date">
                📅 {new Date(expense.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
            </div>
        </div>

        <div className="expense-cost-center">{expense.costCenterName}</div>

        <div className="expense-amount">{formatCurrency(expense.amount)}</div>

        <div className="expense-attachment">
            {expense.attachmentPath && (
                <a
                    href={`http://localhost:5145/api/attachments/${expense.attachmentPath.replace('/uploads/', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="attachment-link"
                >
                    📎 Anexo
                </a>
            )}
        </div>

        // Em frontend/src/components/common/ExpenseRow.jsx
        <div className="expense-actions">
            {!expense.isAutomaticallyCalculated && ( 
                <>
                    <Link to={`/expense/edit/${expense.id}`}>
                        <button className="action-button action-button-edit">✏️</button>
                    </Link>
                    <button
                        className="action-button action-button-delete"
                        onClick={() => onDelete(expense.id)}
                    >
                        🗑️
                    </button>
                </>
            )}
        </div>
    </div>
);

export default ExpenseRow;