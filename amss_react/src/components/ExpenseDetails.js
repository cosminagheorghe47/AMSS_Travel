import React, { useEffect, useState } from 'react';

const ExpenseDetails = ({ expense, onClose, onDelete }) => {
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        if (expense.type === 'GROUP') {
          const expenseUsersResponse = await fetch(`/api/expense-users/expense/${expense.id}`);
          if (!expenseUsersResponse.ok) {
            throw new Error('Failed to fetch expense users');
          }
          const expenseUsers = await expenseUsersResponse.json();

          const userPromises = expenseUsers.map(async (expenseUser) => {
            const userResponse = await fetch(`/api/users/${expenseUser.userId}`);
            if (!userResponse.ok) {
              throw new Error(`Failed to fetch user with ID ${expenseUser.userId}`);
            }
            return { ...expenseUser, user: await userResponse.json() };
          });

          const usersWithAmounts = await Promise.all(userPromises);
          setParticipants(
            usersWithAmounts.map(({ user }) => ({
              ...user,
              amount: (expense.amount / usersWithAmounts.length).toFixed(2),
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching participants:', error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchParticipants();
  }, [expense]);

  const handleDelete = async () => {
    try {
      console.log(`Delete initiated for expense ID: ${expense.id}`);
      
      if (expense.type === 'GROUP') {
        const expenseUsersResponse = await fetch(`/api/expense-users/expense/${expense.id}`);
        if (expenseUsersResponse.ok) {
          const expenseUsers = await expenseUsersResponse.json();
          const deletePromises = expenseUsers.map((expenseUser) =>
            fetch(`/api/expense-users/${expenseUser.id}`, { method: 'DELETE' })
          );
          await Promise.all(deletePromises);
          console.log(`Expense-users for expense ID: ${expense.id} deleted successfully.`);
        }
      }

      const expenseResponse = await fetch(`/api/expenses/${expense.id}`, { method: 'DELETE' });
      if (!expenseResponse.ok) {
        throw new Error('Failed to delete expense');
      }
      console.log(`Expense ID: ${expense.id} deleted successfully.`);

      if (onDelete) {
        onDelete(expense.id);
      }

      onClose();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="modal">
        <div className="modal-content">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal">
      <div className="modal-content" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '30px',
            cursor: 'pointer',
            color: '#555',
          }}
        >
          &times;
        </button>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#4B3F72', marginBottom: '10px' }}>{expense.description}</h3>
          <p style={{ fontSize: '0.9em', color: '#555' }}>
            <strong>Date:</strong> {new Date(expense.creationDate).toLocaleDateString()}
          </p>
        </div>
        <p>
          <strong>Amount:</strong> {expense.amount} RON
        </p>
        <p>
          <strong>Paid By:</strong> {expense.createdById || 'Unknown'}
        </p>
        {expense.type === 'GROUP' && (
          <div>
            <strong>Participants:</strong>
            <ul className="user-list-container" style={{ padding: '0', listStyleType: 'none' }}>
              {participants.map((participant) => (
                <li
                  key={participant.id}
                  style={{
                    background: '#f9f9f9',
                    margin: '5px 0',
                    padding: '10px',
                    borderRadius: '5px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {participant.name} <span style={{ float: 'right' }}>{participant.amount} RON</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div style={{ marginTop: '20px' }}>
          {expense.type === 'GROUP' && (
            <button
              style={{
                display: 'block',
                width: '100%',
                backgroundColor: '#6A5ACD',
                color: 'white',
                padding: '15px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                marginBottom: '10px',
              }}
            >
              Pay
            </button>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <button
              onClick={handleDelete}
              style={{
                backgroundColor: '#FF4D4D',
                color: 'white',
                padding: '10px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetails;
