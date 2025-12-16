import { useState, useEffect } from 'react';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth status
    setLoading(false);
  }, []);

  const login = (credentials) => {
    // Login logic
  };

  const logout = () => {
    // Logout logic
    setUser(null);
  };

  return { user, loading, login, logout };
};

export default useAuth;
