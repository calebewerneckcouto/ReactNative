// userContext.js
import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
    const [pessoas, setPessoas] = useState([]);
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState('')
    const [searchByCategory, setSearchByCategory] = useState(null)
    const values = { 
        pessoas,
        setPessoas,
        loading,
        setLoading,
        user,
        setUser,
        searchByCategory,
        setSearchByCategory,
      }

    const login = (token) => {
        localStorage.setItem('token', token);
        setUser({ token });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const getToken = () => {
        return localStorage.getItem('token');
    };

    return (
        <UserContext.Provider value={values}>
          {children}
        </UserContext.Provider>
      );
    };
    
    export { UserContext, UserProvider };
