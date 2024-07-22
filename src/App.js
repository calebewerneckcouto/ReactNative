import './App.css';
import { UserProvider } from './context/userContext';
import Main from './pages/main';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Comandos from './pages/comandos';
import CEP from './pages/cep';

import SQL from './pages/sql';
import HOLDER from './pages/jsonplaceholder';
import { useEffect, useState } from 'react';


function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    

    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />} />
        {token && (
          <>
            
             <Route path='/jsonplaceholder' element={<HOLDER />} />
            <Route path='/sql' element={<SQL />} />
            <Route path='/comandos' element={<Comandos />} />
            <Route path='/cep' element={<CEP />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

function AppWrapper() {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
}

export default AppWrapper;
