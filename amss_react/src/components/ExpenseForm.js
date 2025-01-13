import React, { useState, useEffect } from 'react';
import { getAuth } from "firebase/auth";

const ExpenseForm = ({ groupDetails, onClose, onAddExpense }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState('individual');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState('');

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/user-groups/group/${groupDetails.id}`);
        if (response.ok) {
          const users = await response.json();
          setSelectedUsers(
            users.map((user) => ({
              ...user,
              isChecked: false,
              amount: 0,
            }))
          );
        } else {
          console.error('Failed to fetch users for group.');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [groupDetails.id]);

  const handleUserToggle = (userId) => {
    setSelectedUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, isChecked: !user.isChecked }
          : user
      )
    );
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setAmount("");
    } else {
      setAmount(parseFloat(value) || 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (amount <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }

    setError('');

    const expenseData = {
      description,
      amount,
      creationDate: new Date().toISOString(),
      type: type.toUpperCase(),
      groupId: groupDetails.id,
      createdById: currentUser.uid,
      createdByName: currentUser.displayName || "Unknown"
    };

    try {
      const expenseResponse = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      });

      if (expenseResponse.ok) {
        const newExpense = await expenseResponse.json();

        const userPromises = selectedUsers
          .filter((user) => user.isChecked)
          .map(async (user) => {
            const isCreator = user.id === currentUser.uid;
            const amountToPay = (amount / selectedUsers.filter((u) => u.isChecked).length).toFixed(2);

            const expenseUserData = {
              expenseId: newExpense.id,
              userId: user.id,
              status: isCreator, // Set status true if current user is the creator
            };

            if (isCreator) {
              // Update `amountPaid` directly in the Expense
              newExpense.amountPaid = parseFloat(amountToPay);
              await fetch(`/api/expenses/${newExpense.id}/update-amount-paid?amountPaid=${newExpense.amountPaid}`, {
                method: 'PUT',
              });
            }

            // Add ExpenseUser entry
            return fetch('/api/expense-users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(expenseUserData),
            });
          });

        await Promise.all(userPromises);

        onAddExpense(newExpense);

        onClose();
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Expense</h2>
      <div>
        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            required
          />
        </label>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>
          Type:
          <div className="user-list-container">
            <input
              type="radio"
              id="INDIVIDUAL"
              checked={type === 'individual'}
              onChange={() => setType('individual')}
            /> Individual
            <input
              type="radio"
              id="GROUP"
              checked={type === 'group'}
              onChange={() => setType('group')}
            /> Group
          </div>
        </label>
      </div>

      {type === 'group' && (
        <div>
          <h3>Split Between:</h3>
          <div className="user-list-container">
            {selectedUsers.length > 0 ? (
              selectedUsers.map((user) => (
                <div key={user.id} className="user-checkbox">
                  <input
                    type="checkbox"
                    id={`user-${user.id}`}
                    checked={user.isChecked}
                    onChange={() => handleUserToggle(user.id)}
                  />
                  <label htmlFor={`user-${user.id}`}>{user.name}</label>
                </div>
              ))
            ) : (
              <p>No users available.</p>
            )}
          </div>
        </div>
      )}

      <button style={{
                display: 'block',
                width: '100%',
                backgroundColor:'#6A5ACD',
                color:'white',
                padding: '15px',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                marginBottom: '0px',
              }} type="submit">Create</button>
      <button style={{
                display: 'block',
                width: '100%',
                backgroundColor:'#d3d3d3',
                color:'white',
                padding: '15px',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                marginBottom: '10px',
                marginLeft: '0px',
              }}
              type="button" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
};

export default ExpenseForm;
