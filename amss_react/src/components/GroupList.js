import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GroupList = ({ refreshGroups }) => {
  const [groups, setGroups] = useState([]);

  const fetchGroups = async () => {
    try {
      const response = await axios.get('/api/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [refreshGroups]);

  return (
    <div>
      <h2>Groups</h2>
      <ul className="group-list">
        {groups.map((group) => (
          <li key={group.id}>
            <h3>{group.name}</h3>
            <p><strong>Description:</strong> {group.description}</p>
            <p><strong>Start Date:</strong> {new Date(group.startDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {new Date(group.endDate).toLocaleDateString()}</p>
            <div>
              <strong>Members:</strong>
              <ul>
                {group.users && group.users.length > 0 ? (
                  group.users.map((user) => (
                    <li key={user.uid}>{user.email}</li>
                  ))
                ) : (
                  <p>No members assigned.</p>
                )}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupList;
