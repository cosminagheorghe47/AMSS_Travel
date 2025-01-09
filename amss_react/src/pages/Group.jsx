import React, { useState } from 'react';
import GroupForm from "../components/GroupForm";
import GroupList from "../components/GroupList";
import { useNavigate } from 'react-router-dom';

const Group = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [refreshGroups, setRefreshGroups] = useState(false);
    const navigate = useNavigate();
  
    const handleAddGroup = () => {
      setRefreshGroups(!refreshGroups);
    };

    const handleGroupClick = (groupId) => {
      navigate(`/groups/${groupId}`);
    };

    return (
      <div>
        <h1>Travel Management</h1>
        <button onClick={() => setIsFormOpen(true)}>Add New Group</button>

        {isFormOpen && (
          <div className="modal">
            <div className="modal-content">
              <GroupForm onClose={() => setIsFormOpen(false)} onAddGroup={handleAddGroup} />
            </div>
          </div>
        )}
  
        <GroupList refreshGroups={refreshGroups} onGroupClick={handleGroupClick}/>
      </div>
    );
}

export default Group;