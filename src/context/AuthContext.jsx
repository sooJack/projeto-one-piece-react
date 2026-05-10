import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const MASTER_PASSWORD = 'grandlinde2024';

export function AuthProvider({ children }) {
  const [isMaster, setIsMaster] = useState(() => {
    return sessionStorage.getItem('op-master') === '1';
  });

  const login = (password) => {
    if (password === MASTER_PASSWORD) {
      setIsMaster(true);
      sessionStorage.setItem('op-master', '1');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsMaster(false);
    sessionStorage.removeItem('op-master');
  };

  return (
    <AuthContext.Provider value={{ isMaster, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
