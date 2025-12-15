import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spin } from 'antd';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>;
  }
  
  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
