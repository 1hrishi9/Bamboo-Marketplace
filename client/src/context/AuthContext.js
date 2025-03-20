import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('token'));
  const [userRole, setUserRole] = useState(sessionStorage.getItem('userRole') || null);

  const login = (token, role) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('userRole', role);
    sessionStorage.setItem('lastActivity', Date.now().toString());
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('lastActivity');
    setIsLoggedIn(false);
    setUserRole(null);
  };

  useEffect(() => {
    const sessionTimeout = 30 * 60 * 1000; // 30 minutes
    const lastActivity = sessionStorage.getItem('lastActivity');
    const currentTime = Date.now();

    if (lastActivity && currentTime - parseInt(lastActivity) > sessionTimeout) {
      logout();
    }

    const updateLastActivity = () => {
      sessionStorage.setItem('lastActivity', Date.now().toString());
    };

    window.addEventListener('click', updateLastActivity);
    window.addEventListener('keypress', updateLastActivity);
    window.addEventListener('mousemove', updateLastActivity);

    const interval = setInterval(() => {
      const lastActivity = sessionStorage.getItem('lastActivity');
      const currentTime = Date.now();
      if (lastActivity && currentTime - parseInt(lastActivity) > sessionTimeout) {
        logout();
      }
    }, 60 * 1000);

    return () => {
      window.removeEventListener('click', updateLastActivity);
      window.removeEventListener('keypress', updateLastActivity);
      window.removeEventListener('mousemove', updateLastActivity);
      clearInterval(interval);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}