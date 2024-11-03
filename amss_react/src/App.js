// src/App.js
import React from 'react';
import GroupForm from './components/GroupForm';
import GroupList from './components/GroupList';
function App() {
  return (
    <div>
      <h1>Group Management</h1>
      <GroupForm />
      <GroupList />
    </div>

  );
}

export default App;
