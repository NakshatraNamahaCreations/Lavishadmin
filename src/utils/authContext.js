// import React, { createContext, useContext, useState, useEffect } from 'react';

// // Create a Context for Auth
// const AuthContext = createContext();

// // Create a provider component
// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem('accessToken'));

//   useEffect(() => {
//     const storedToken = localStorage.getItem('accessToken');
//     if (storedToken) {
//       setToken(storedToken);
//     }
//   }, []);

//   const login = (token) => {
//     localStorage.setItem('accessToken', token);
//     setToken(token);
//   };

//   const logout = () => {
//     localStorage.removeItem('accessToken');
//     setToken(null);
//   };

//   return (
//     <AuthContext.Provider value={{ token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use auth context
// export const useAuth = () => useContext(AuthContext);



import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a Context for Auth
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('accessToken'));

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('accessToken', token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setToken("");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
