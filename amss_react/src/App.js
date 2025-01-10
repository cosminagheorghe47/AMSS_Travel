import React from 'react';
import './App.css';
import Login from './pages/Login';
import Group from './pages/Group';
import { Routes, Route, useLocation  } from "react-router-dom";
import Register from './pages/Register';

import Profile from './pages/Profile';
import Sidemenu from './components/Sidemenu';
import PrivateRoute from './components/PrivateRoute';

import Expense from './pages/Expense';


function App() {
  const location = useLocation(); 

  const shouldShowSidemenu = location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/register';
  return (
    <>
      {shouldShowSidemenu && <Sidemenu />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Group />} />
        {/* <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
        <Route path="/home" element={<PrivateRoute element={<Group />} />} /> */}

        <Route path="/group/:groupId" element={<Expense />} />

      </Routes>
    </>
  )
}

export default App;
