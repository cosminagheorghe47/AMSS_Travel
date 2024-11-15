import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GroupForm = ({ onClose, onAddGroup }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/auth/users');
        setUsers(response.data);
      } catch (error) {
        setError('Error fetching users: ' + error.message);
      }
    };
    fetchUsers();
  }, []);

  const handleUserChange = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const groupData = {
      name,
      description,
      startDate,
      endDate,
      users: selectedUsers.map((id) => ({ id })),
    };

    try {
      await axios.post('http://localhost:8080/api/groups', groupData);

      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setSelectedUsers([]);

      onAddGroup();
      onClose();
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a New Group</h2>
      <div>
        <label>
          Group Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <h3>Select Users:</h3>
       <div className="user-list-container">
         {users.length > 0 ? (
           users.map((user) => (
             <div key={user.uid} className="user-checkbox">
               <input
                 type="checkbox"
                 id={`user-${user.uid}`}
                 checked={selectedUsers.includes(user.uid)}
                 onChange={() => handleUserChange(user.uid)}
               />
               <label htmlFor={`user-${user.uid}`}>{user.displayName}</label>
             </div>
           ))
         ) : (
           <p>No users available.</p>
         )}
       </div>

      </div>
      <button type="submit">Create Group</button>
      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
};

export default GroupForm;
