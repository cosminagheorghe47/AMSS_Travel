import React, { useState } from 'react';

const ExpenseForm = ({ groupDetails, onClose, onAddExpense }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState('individual');
  const [selectedUsers, setSelectedUsers] = useState(
    groupDetails.users.map((user) => ({
      ...user,
      isChecked: false,
      amount: 0,
    }))
  );

  const handleUserToggle = (userId) => {
    setSelectedUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, isChecked: !user.isChecked }
          : user
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const expenseData = {
      description,
      amount,
      type,
      groupId: groupDetails.id,
      users: selectedUsers
        .filter((user) => user.isChecked)
        .map((user) => user.id),
    };

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      });

      if (response.ok) {
        const newExpense = await response.json();
        onAddExpense(newExpense);
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Expense</h3>
      <label>
        Description:
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>
      <label>
        Amount:
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          required
        />
      </label>
      <label>
        Type:
        <input
          type="radio"
          value="individual"
          checked={type === 'individual'}
          onChange={() => setType('individual')}
        /> Individual
        <input
          type="radio"
          value="group"
          checked={type === 'group'}
          onChange={() => setType('group')}
        /> Group
      </label>

      {type === 'group' && (
        <div>
          <h4>Split Between:</h4>
          <ul>
            {selectedUsers.map((user) => (
              <li key={user.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={user.isChecked}
                    onChange={() => handleUserToggle(user.id)}
                  />
                  {user.name}
                </label>
              </li>
            ))}
          </ul>
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