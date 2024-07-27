import React, { useState, useEffect, useRef } from 'react';
import './sql.css'; // Certifique-se de ter o arquivo pokedex.css com os estilos necessários
import { useNavigate } from 'react-router-dom';

function SQL() {
    const [alunos, setAlunos] = useState([]);
    const [sql, setSql] = useState('');
    const navigate = useNavigate();
   

    const handleComandosSQL = () => {
        navigate('/comandos');
    };

    const handleJsonPlaceHolder = () => {
        navigate('/jsonplaceholder');
    };

    const handleCardapio = () => {
        navigate('/heroinput');
    };

    

    const handleViaCep = () => {
        navigate('/cep');
    };

    const handleLogout = () => {
        // Recuperar o id do usuário do localStorage
        const userId = localStorage.getItem('userId');

        // Enviar uma requisição para o endpoint de logout no servidor
        fetch('http://localhost:5000/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }), // Enviar o userId para o servidor
        })
        .then(response => {
            if (response.ok) {
                // Limpar dados do localStorage
                localStorage.removeItem('userId');
                localStorage.removeItem('token');

                // Redirecionar para a página de login
                navigate('/'); // Use navigate do react-router-dom, se estiver usando
            } else {
                throw new Error('Logout failed');
            }
        })
        .catch(error => {
            console.error('Logout error:', error);
            // Lidar com o erro de logout, se necessário
        });
    };

    useEffect(() => {
        executeSql(); // Executar SQL ao carregar a página
    }, []);

    const executeSql = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/execute-sql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sql }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setAlunos(data);
        } catch (error) {
            console.error('Failed to execute SQL:', error);
            // Lidar com o erro de execução SQL, se necessário
        }
    };

    return (
        <div className="pokedex-container">
            <h1>Lista de Alunos</h1>
            <div className="sql-controls">
                <button onClick={handleComandosSQL} className="sql-button">
                    Comandos SQL
                </button>
                <button onClick={executeSql} className="sql-button">
                    Executar SQL
                </button>

                <button onClick={handleJsonPlaceHolder}>Api PlaceHolder</button>
                <button onClick={handleLogout}>Logout</button>
                <button onClick={handleViaCep} >Api Via Cep</button>
                <button onClick={handleCardapio} >Cardápio</button>

            </div>
            <textarea
                value={sql}
                onChange={(e) => setSql(e.target.value)}
                placeholder="Digite seu comando SQL aqui"
                className="sql-textarea"
                rows="4"
                cols="50"
            />
            {alunos.length > 0 ? (
                <table className="alunos-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Data de Nascimento</th>
                            <th>Nota de Matemática</th>
                            <th>Nota de Física</th>
                            <th>Nota de Química</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alunos.map((aluno) => (
                            <tr key={aluno.id}>
                                <td>{aluno.id}</td>
                                <td>{aluno.nome}</td>
                                <td>{aluno.email}</td>
                                <td>{aluno.data_nascimento}</td>
                                <td>{aluno.nota_matematica}</td>
                                <td>{aluno.nota_fisica}</td>
                                <td>{aluno.nota_quimica}</td>
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

export default SQL;
