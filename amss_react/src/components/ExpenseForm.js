import React, { useState, useEffect } from 'react';

const ExpenseForm = ({ groupDetails, onClose, onAddExpense }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState('individual');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState('');

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

    // Validation: Check if amount is greater than 0
    if (amount <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }

    setError(''); // Clear previous errors

    const expenseData = {
      description,
      amount,
      creationDate: new Date().toISOString(),
      type: type.toUpperCase(),
      groupId: groupDetails.id,
      createdById: 0   //DE SCHIMBAT CU USERUL CURENT
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
          .map((user) => {
            const expenseUserData = {
              expenseId: newExpense.id,
              userId: user.id,
            };

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
          type="checkbox"
          id="INDIVIDUAL"
          checked={type === 'individual'}
          onChange={() => setType('individual')}
        /> Individual
        <input
          type="checkbox"
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
            {selectedUsers.length>0 ? (
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

      <button type="submit">Create</button>
      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
};

export default ExpenseForm;