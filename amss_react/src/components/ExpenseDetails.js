import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth'; 

const ExpenseDetails = ({ expense, onClose, onDelete }) => {
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createdByName, setCreatedByName] = useState('Unknown');
  const [isPayButtonActive, setIsPayButtonActive] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); 

  useEffect(() => {
    // Obține utilizatorul curent din Firebase Authentication
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setCurrentUser(user);
    } else {
      console.error('No authenticated user found.');
    }
  }, []);


  useEffect(() => {

    if (!currentUser) return;
    
    const fetchCreatorName = async () => {
      try {
        const userResponse = await fetch(`/auth/users/${expense.createdById}`);
        if (!userResponse.ok) {
          throw new Error(`Failed to fetch user with ID ${expense.createdById}`);
        }
        const userData = await userResponse.json();
        setCreatedByName(userData.name || 'Unknown');
      } catch (error) {
        console.error('Error fetching creator name:', error);
      }
    };

    const fetchParticipants = async () => {
      try {
        const expenseUsersResponse = await fetch(`/api/expense-users/expense/${expense.id}`);
        if (!expenseUsersResponse.ok) {
          throw new Error('Failed to fetch expense users');
        }
        const expenseUsers = await expenseUsersResponse.json();

        const userPromises = expenseUsers.map(async (expenseUser) => {
          const userResponse = await fetch(`/auth/users/${expenseUser.userId}`);
          if (!userResponse.ok) {
            throw new Error(`Failed to fetch user with ID ${expenseUser.userId}`);
          }
          return { ...expenseUser, user: await userResponse.json() };
        });

        const usersWithAmounts = await Promise.all(userPromises);
        setParticipants(
          usersWithAmounts.map(({ user, ...expenseUser }) => ({
            ...expenseUser,
            name: user.name || 'Unknown',
            amount: (expense.amount / usersWithAmounts.length).toFixed(2),
          }))
        );

        const currentUserParticipant = usersWithAmounts.find(
          (participant) => participant.user.id === currentUser.uid
        );
        console.log('Current User Participant:', currentUserParticipant); // Debugging
        setIsPayButtonActive(
          currentUserParticipant &&
          !currentUserParticipant.status &&
          currentUser.uid !== expense.createdById
        );
      } catch (error) {
        console.error('Error fetching participants:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreatorName();
    fetchParticipants();
  }, [expense, currentUser]);

  const handlePay = async () => {
    try {
      const participant = participants.find((p) => p.userId === currentUser.uid);
      console.log('Handle Pay Participant:', participant);
      if (!participant || participant.status) return;

      const newAmountPaid = expense.amountPaid + parseFloat(participant.amount);

       // Update `amountPaid` în server
       await fetch(`/api/expenses/${expense.id}/update-amount-paid?amountPaid=${newAmountPaid}`, {
        method: 'PUT',
      });
  
      // Update status pe server
      await fetch(`/api/expense-users/${participant.id}/update-status?status=true`, {
        method: 'PUT',
      });
  
      setParticipants((prev) =>
        prev.map((p) =>
          p.userId === currentUser.uid ? { ...p, status: true } : p
        )
      );
      setIsPayButtonActive(false);

      onClose(); // Închide modalul
      
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const expenseUsersResponse = await fetch(`/api/expense-users/expense/${expense.id}`);
      if (expenseUsersResponse.ok) {
        const expenseUsers = await expenseUsersResponse.json();
        const deletePromises = expenseUsers.map((expenseUser) =>
          fetch(`/api/expense-users/${expenseUser.id}`, { method: 'DELETE' })
        );
        await Promise.all(deletePromises);
      }

      const expenseResponse = await fetch(`/api/expenses/${expense.id}`, { method: 'DELETE' });
      if (!expenseResponse.ok) {
        throw new Error('Failed to delete expense');
      }

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
        <p style={{ textAlign: 'left'}}>
          <strong>Amount:</strong> {expense.amount} RON
        </p>
        <p style={{ textAlign: 'left'}}>
          <strong>Paid By:</strong> {createdByName}
        </p>
        {expense.type === 'GROUP' && (
          <div>
            <p style={{ textAlign: 'left'}} >
            <strong >Participants:</strong>
            </p>
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
                  {participant.name}{' '}
                  <span style={{ float: 'right' }}>
                    {participant.status ? 'Paid' : `${participant.amount} RON`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div style={{ marginTop: '20px' }}>
          {expense.type === 'GROUP' && (
            <button
              onClick={handlePay}
              disabled={!isPayButtonActive}
              style={{
                display: 'block',
                width: '100%',
                backgroundColor: isPayButtonActive ? '#6A5ACD' : '#d3d3d3',
                color: isPayButtonActive ? 'white' : '#555',
                padding: '15px',
                border: 'none',
                borderRadius: '5px',
                cursor: isPayButtonActive ? 'pointer' : 'not-allowed',
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
