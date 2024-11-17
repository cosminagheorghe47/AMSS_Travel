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

  // Fetch the users from the backend
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
    };

    try {
      // Step 1: Create the group and get its id
      const groupResponse = await axios.post('http://localhost:8080/api/groups', groupData);
      const createdGroupId = groupResponse.data.id;

      if (!createdGroupId) {
        throw new Error("Group ID not returned from group creation.");
      }
        console.log(createdGroupId);
      // Step 2: Add selected users to the created group
      if (selectedUsers.length > 0) {
        const userGroupData = {
          groupId: createdGroupId, // Pass the groupId
          userIds: selectedUsers,   // Pass the selected user IDs
        };

        await axios.post('http://localhost:8080/api/user-groups/addUsersToGroup', userGroupData);
      }

      // Reset form and close modal
      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setSelectedUsers([]);

      onAddGroup();
      onClose();
    } catch (error) {
      console.error('Error creating group or adding users:', error);
      setError(error.message || 'An unexpected error occurred');
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
              <div key={user.id} className="user-checkbox">
                <input
                  type="checkbox"
                  id={`user-${user.id}`}
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleUserChange(user.id)}
                />
                <label htmlFor={`user-${user.id}`}>{user.name}</label>
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
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default GroupForm;
