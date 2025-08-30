import React from 'react';
import { Link } from 'react-router-dom';
import ExpenseCardDetails from './ExpenseCardDetails'; // Importa o novo componente

const ExpenseRow = ({ expense, onDelete, formatCurrency, onPreview }) => (
    <div className="expense-row">
        <div className="expense-info">
            <div className="expense-description">{expense.description}</div>
            {/* Linha de detalhes dinâmicos */}
            <ExpenseCardDetails expense={expense} />
            <div className="expense-date" style={{marginTop: '8px', fontSize: '0.8rem'}}>
                📅 {new Date(expense.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
            </div>
        </div>

        <div className="expense-cost-center">{expense.costCenterName}</div>

        <div className="expense-amount">{formatCurrency(expense.amount)}</div>

       <div className="expense-attachment">
            {expense.attachmentPath && (
                <button
                    onClick={() => onPreview(expense.attachmentPath)}
                    className="attachment-link"
                    style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                >
                    📎 Anexo
                </button>
            )}
        </div>
       
        <div className="expense-actions">
            {!expense.isVirtual && ( 
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