import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import './holder.css'; // Arquivo de estilos CSS para a tabela de imagens

function HOLDER() {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
   
    const handleComandosSQL = () => {
        navigate('/comandos');
    };

    const handleTreinarSQL = () => {
        navigate('/sql');
    };

    const handleCardapio = () => {
        navigate('/heroinput');
    };

   

    const handleCep = ()=>{
        navigate('/cep');
    };

    const handleLogout = () => {
        const userId = localStorage.getItem('userId');

        fetch('http://localhost:5000/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }), 
        })
        .then(response => {
            if (response.ok) {
                localStorage.removeItem('userId');
                localStorage.removeItem('token');
                navigate('/');
            } else {
                throw new Error('Logout failed');
            }
        })
        .catch(error => {
            console.error('Logout error:', error);
        });
    };

    useEffect(() => {
        buscarPosts(); 
    }, []);

    const buscarPosts = async () => {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts`);
            if (!response.ok) {
                throw new Error('Erro ao buscar posts');
            }
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Erro ao buscar posts:', error);
        }
    };

    return (
        <div className="pokedex-container">
            <h1>Lista de Posts</h1>
            <button onClick={handleTreinarSQL}>Treinar SQL</button>           
            <button onClick={handleCep}>Api Via Cep</button>
            <button onClick={handleComandosSQL}>Comandos SQL</button>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleCardapio}>Cardápio</button>

            
            {posts.length > 0 ? (
                <table className="posts-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Corpo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post.id}>
                                <td>{post.id}</td>
                                <td>{post.title}</td>
                                <td>{post.body}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Carregando dados...</p>
            )}
        </div>
    );
}

export default HOLDER;
