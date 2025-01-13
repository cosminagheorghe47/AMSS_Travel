import React, { useEffect, useState } from 'react';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GroupList = ({ refreshGroups }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserGroups(currentUser.uid);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserGroups(user.uid);
    }
  }, [refreshGroups, user]);

  const fetchUserGroups = async (userId) => {
    try {
      const fetchedGroups = await axios.get('/api/groups');

      const groupsWithUsers = await Promise.all(
        fetchedGroups.data.map(async (group) => {
          const users = await fetchUsersForGroup(group.id);
          if (users.some((user) => user.id === userId)) {
            return {
              ...group,
              users: users,
            };
          }
          return null;
        })
      );

      const userGroups = groupsWithUsers.filter((group) => group !== null);

      setGroups(userGroups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const fetchUsersForGroup = async (groupId) => {
    try {
      const response = await axios.get(`/api/user-groups/group/${groupId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching users for group ${groupId}:`, error);
      return [];
    }
  };

  const handleGroupClick = (groupId) => {
    navigate(`/group/${groupId}`);
  };

  const handleNavigateLogin = () => {
    navigate("/login");
  }

  const deleteGroup = async (groupId) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        await axios.delete(`/api/groups/${groupId}`);
        alert('Group deleted successfully.');
        fetchUserGroups(user.uid); // Refresh the list after deleting
      } catch (error) {
        console.error('Error deleting group:', error);
        alert('Failed to delete group.');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className='no-user'>
        No user logged in 
        <div> 
          <button onClick={handleNavigateLogin}>LOG IN</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1>Group List</h1>
      <ul className="group-list">
        {groups.map((group) => (
          <li
            key={group.id}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              margin: '10px 0',
            }}
          >
            <h3
              onClick={() => handleGroupClick(group.id)}
              style={{ cursor: 'pointer', color: 'blue' }}
            >
              {group.name}
            </h3>
            <p>
              <strong>Description:</strong> {group.description}
            </p>
            <p>
              <strong>Start Date:</strong>{' '}
              {new Date(group.startDate).toLocaleDateString()}
            </p>
            <p>
              <strong>End Date:</strong>{' '}
              {new Date(group.endDate).toLocaleDateString()}
            </p>
            <button
              onClick={() => deleteGroup(group.id)}
              style={{
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer',
                marginTop: '10px',
              }}
            >
              Delete Group
            </button>
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
