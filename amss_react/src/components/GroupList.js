import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GroupList = ({ refreshGroups }) => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

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

  const handleGroupClick = (groupId) => {
    navigate(`/group/Id=${groupId}`);
  };

  return (
    <div>
      <h2>Groups</h2>
      <ul className="group-list">
        {groups.map((group) => (
          <li 
            key={group.id}
            onClick={() => handleGroupClick(group.id)}
            style={{ cursor: 'pointer', border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}
            >
            <h3>{group.name}</h3>
            <p><strong>Description:</strong> {group.description}</p>
            <p><strong>Start Date:</strong> {new Date(group.startDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {new Date(group.endDate).toLocaleDateString()}</p>
            <div>
              <strong>Members:</strong>
              <ul>
                {group.users && group.users.length > 0 ? (
                  group.users.map((user) => (
                    <li key={user.id}>{user.name}</li>
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
