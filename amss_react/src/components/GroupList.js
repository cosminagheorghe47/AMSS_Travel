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

  const fetchUsersForGroup = async (groupId) => {
    try {
      const response = await axios.get(`/api/user-groups/group/${groupId}`);
      console.log(`Users for group ${groupId}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching users for group ${groupId}:`, error);
      return [];
    }
  };

  useEffect(() => {
   const fetchAllGroupsWithUsers = async () => {
     const fetchedGroups = await axios.get('/api/groups');
     const groupsWithUsers = await Promise.all(
       fetchedGroups.data.map(async (group) => {
         const users = await fetchUsersForGroup(group.id);
         console.log('Fetched users for group:', group.id, users); // Debug log
         return {
           ...group,
           users: users,
         };
       })
     );
     console.log('Groups with users:', groupsWithUsers); // Debug log
     setGroups(groupsWithUsers);
   };

    fetchAllGroupsWithUsers();
  }, [refreshGroups]);

  const handleGroupClick = (groupId) => {
    navigate(`/group/${groupId}`);
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
