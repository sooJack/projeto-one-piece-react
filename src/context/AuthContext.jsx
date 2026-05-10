import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const MASTER_PASSWORD = import.meta.env.VITE_MASTER_PASSWORD || 'grandline2024';

export function AuthProvider({ children }) {
  const [isMaster, setIsMaster] = useState(() => {
    return localStorage.getItem('op-master') === '1';
  });

  const login = (password) => {
    console.log('Tentando login com senha:', password);
    console.log('Senha mestre esperada:', MASTER_PASSWORD);
    if (password === MASTER_PASSWORD) {
      setIsMaster(true);
      localStorage.setItem('op-master', '1');
      console.log('Login bem-sucedido');
      return true;
    }
    console.log('Login falhou');
    return false;
  };

  const logout = () => {
    setIsMaster(false);
    localStorage.removeItem('op-master');
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
