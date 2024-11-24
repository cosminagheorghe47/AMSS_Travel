import React from 'react';

const ExpenseList = ({ expenses }) => {
  if (!expenses || expenses.length === 0) {
    return <p>No expenses recorded for this group.</p>;
  }

  return (
    <ul>
      {expenses.map((expense) => (
        <li
          key={expense.id}
          style={{
            border: '1px solid #ccc',
            margin: '10px 0',
            padding: '10px',
          }}
        >
          <p><strong>Created by:</strong>{expense.createdBy}</p>  
          <p><strong>Description:</strong> {expense.description}</p>
          <p><strong>Amount:</strong> {expense.amount.toFixed(2)} RON</p>
          <p><strong>Type:</strong> {expense.type}</p>
        </li>
      ))}
    </ul>
  );
};

export default ExpenseList;
