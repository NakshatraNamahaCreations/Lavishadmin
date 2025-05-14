// import React, { createContext, useContext, useState, useEffect } from 'react';

// // Create a Context for Auth
// const AuthContext = createContext();

// // Create a provider component
// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(sessionStorage.getItem('accessToken'));

//   useEffect(() => {
//     const storedToken = sessionStorage.getItem('accessToken');
//     if (storedToken) {
//       setToken(storedToken);
//     }
//   }, []);

//   const login = (token) => {
//     sessionStorage.setItem('accessToken', token);
//     setToken(token);
//   };

//   const logout = () => {
//     sessionStorage.removeItem('accessToken');
//     setToken("");
//   };

//   return (
//     <AuthContext.Provider value={{ token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use auth context
// export const useAuth = () => useContext(AuthContext);





// utils/authContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(sessionStorage.getItem('accessToken'));
  const [currentAdmin, setCurrentAdmin] = useState(() => {
    const storedAdmin = sessionStorage.getItem('admin');
    return storedAdmin ? JSON.parse(storedAdmin) : null;
  });

  useEffect(() => {
    const storedToken = sessionStorage.getItem('accessToken');
    const storedAdmin = sessionStorage.getItem('admin');
    if (storedToken) setToken(storedToken);
    if (storedAdmin) setCurrentAdmin(JSON.parse(storedAdmin));
  }, []);

  const login = (token, admin) => {
    sessionStorage.setItem('accessToken', token);
    sessionStorage.setItem('admin', JSON.stringify(admin));
    setToken(token);
    setCurrentAdmin(admin);
  };

  const logout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('admin');
    setToken("");
    setCurrentAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ token, currentAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
