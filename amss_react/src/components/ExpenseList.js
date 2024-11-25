import React from 'react';

const ExpenseList = ({ expenses }) => {
  if (!expenses || expenses.length === 0) {
    return <p>No expenses recorded for this group.</p>;
  }

  return (
    <div>
      <h2>Expenses</h2>
      <ul className="group-list">
      {expenses.map((expense) => (
        <li
          key={expense.id}
          style={{ cursor: 'pointer', border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}
        >
          <p>
            <strong>Created by:</strong>{" "}
            {expense.createdById || "Unknown"}
          </p> 
          <p><strong>Description:</strong> {expense.description}</p>
          <p><strong>Amount:</strong> {expense.amount.toFixed(2)} RON</p>
          <p><strong>Type:</strong> {expense.type}</p>
        </li>
      ))}
    </ul>
    </div>
  );
};

export default ExpenseList;
