// src/components/RoleRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RoleRoute = ({ element: Component, role, ...rest }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;

  return <Component {...rest} />;
};

export default RoleRoute;