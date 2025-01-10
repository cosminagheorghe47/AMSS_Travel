import React, { useState } from 'react';
import ExpenseDetails from './ExpenseDetails';

const ExpenseList = ({ expenses, onDeleteExpense  }) => {
  const [selectedExpense, setSelectedExpense] = useState(null);

  if (!expenses || expenses.length === 0) {
    return <p>No expenses recorded for this group.</p>;
  }

  const handleExpenseClick = (expense) => {
    setSelectedExpense(expense);
  };

  const handleCloseModal = () => {
    setSelectedExpense(null);
  };

  const handleDeleteExpense = (expenseId) => {
    onDeleteExpense(expenseId);
    setSelectedExpense(null); 
  };


  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
  );

  return (
    <div>
      <div style={{ marginLeft: 20, marginRight: 20 }}>
        <h2>Expenses</h2>
        <ul className="group-list">
          {sortedExpenses.map((expense) => (
            <li
              key={expense.id}
              onClick={() => handleExpenseClick(expense)}
              style={{
                cursor: 'pointer',
                border: '1px solid #ccc',
                padding: '10px',
                margin: '10px 0',
              }}
            >
              <div style={{ flex: 2 }}>
                <p
                  style={{
                    fontWeight: 'bold',
                    marginLeft: 0,
                    textTransform: 'uppercase',
                  }}
                >
                  {expense.description}
                </p>
                <p style={{ marginTop: 10 }}>{expense.createdById || 'Unknown'}</p>
              </div>
              <div
                style={{
                  flex: 1,
                  textAlign: 'right',
                  fontWeight: 'bold',
                }}
              >
                {expense.amount.toFixed(2)} RON
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedExpense && (
        <ExpenseDetails
          expense={selectedExpense}
          onClose={handleCloseModal}
          onDelete={handleDeleteExpense}
        />
      )}
    </div>
  );
};

export default ExpenseList;
