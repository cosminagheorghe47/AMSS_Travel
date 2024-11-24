import React from 'react';
import './App.css';
import Login from './pages/Login';
import Group from './pages/Group';
import { Routes, Route } from "react-router-dom";
import Register from './pages/Register';
import Expense from './pages/Expense';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Group />} />
        <Route path="/groups/Id=:groupId" element={<Expense />} />
      </Routes>
    </>
  )
}

export default App;
