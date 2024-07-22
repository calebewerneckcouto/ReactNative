import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/header.css';

function Header() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ login: email, senha }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token); // Salvando o token no localStorage

                // Redirecionar para a página de comandos e forçar a atualização
                navigate('/comandos', { replace: true });
                window.location.reload(); // Força a recarga da página para atualizar o token
            } else {
                const errorText = await response.text();
                alert(errorText);
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Erro no servidor. Tente novamente mais tarde.');
        }
    };

    return (
        <nav>
            <img src='favicon.ico' alt="some stuff"/>
            <div className='login-field'>
                <p>Login:</p>
                <input
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    placeholder='Senha'
                    type='password'
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
            </div>
        </nav>
    );
}

export default Header;
