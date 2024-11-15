import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const PrivateRoute = ({ element, ...rest }) => {
  const user = firebase.auth().currentUser;
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};

export default PrivateRoute;
