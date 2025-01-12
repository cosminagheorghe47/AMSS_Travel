import React, { useState, useEffect  } from 'react';
import ExpenseDetails from './ExpenseDetails';

const ExpenseList = ({ expenses, onDeleteExpense  }) => {
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userNames, setUserNames] = useState({});

  useEffect(() => {
    const fetchUserNames = async () => {
      const userIdSet = new Set(expenses.map((expense) => expense.createdById));
      const userIdArray = Array.from(userIdSet);

      const userNamePromises = userIdArray.map(async (userId) => {
        try {
          const response = await fetch(`/auth/users/${userId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch user with ID ${userId}`);
          }
          const user = await response.json();
          return { userId, name: user.name || 'Unknown' };
        } catch (error) {
          console.error(error);
          return { userId, name: 'Unknown' };
        }
      });

      const userNameResults = await Promise.all(userNamePromises);
      const userNameMap = {};
      userNameResults.forEach(({ userId, name }) => {
        userNameMap[userId] = name;
      });
      setUserNames(userNameMap);
    };

    if (expenses && expenses.length > 0) {
      fetchUserNames();
    }
  }, [expenses]);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, []);

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

  const sortedExpenses = expenses && expenses.length > 0
    ? [...expenses].sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate))
    : [];

  if (loading) {
    return <p>Loading expenses...</p>;
  }

  if (!expenses || expenses.length === 0) {
    return <p>No expenses recorded for this group.</p>;
  }


  return (
    <div>
      <div style={{ marginLeft: 20, marginRight: 20 }}>
        <h2>Expenses</h2>
        <ul className="group-list">
          {sortedExpenses.map((expense) => {
            // Debugging: Log values of amountPaid and amount
            console.log(
              `Expense ID: ${expense.id}, type: ${expense.type}, amountPaid: ${expense.amountPaid}, amount: ${expense.amount}, condition: ${parseFloat(expense.amountPaid) >= parseFloat(expense.amount)}`
            );

            return (
              <li
                key={expense.id}
                onClick={() => handleExpenseClick(expense)}
                style={{
                  cursor: 'pointer',
                  border: '1px solid #ccc',
                  padding: '10px',
                  margin: '10px 0',
                  backgroundColor: parseFloat(expense.amountPaid) >= parseFloat(expense.amount) ? '#d3d3d3' : 'white',
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
                  <p style={{ marginTop: 10 }}>{userNames[expense.createdById] || 'Unknown'}</p>
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
            );
          })}
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
