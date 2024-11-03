import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GroupForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [creatorId] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/users');
            setUsers(response.data);
        } catch (error) {
            setError('Error fetching users: ' + error.message);
        }
    };

    fetchUsers();
  }, []);

  const handleUserChange = (userId) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter((id) => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };

  const handleSubmit = async (event) => {
      event.preventDefault();

      const groupData = {
          name,
          description,
          startDate,
          endDate,
          users: selectedUsers.map(id => ({ id }))
      };

      console.log('Submitting group data:', groupData);

      try {
          const response = await axios.post('http://localhost:8080/api/groups', groupData);
          console.log('Group created:', response.data);

          setName('');
          setDescription('');
          setStartDate('');
          setEndDate('');
          setSelectedUsers([]);
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
        {users.length > 0 ? ( // Check if users exist
          users.map((user) => (
            <div key={user.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleUserChange(user.id)}
                />
                {user.name}
              </label>
            </div>
          ))
        ) : (
          <p>No users available.</p> // Message if no users found
        )}
      </div>
      <button type="submit">Create Group</button>
    </form>
  );
};

export default GroupForm;
