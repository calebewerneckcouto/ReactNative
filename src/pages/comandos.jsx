import React, { useState } from 'react';
import './../pages/Comando.css'; // Importando o arquivo CSS para estilização
import { useNavigate } from 'react-router-dom';


function Comandos() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCommand, setCurrentCommand] = useState('');
    const navigate = useNavigate();

    const commandDescriptions = {
        SELECT: 'Recupera dados de uma ou mais tabelas.',
        'INSERT INTO': 'Insere novos registros em uma tabela.',
        UPDATE: 'Atualiza registros existentes em uma tabela.',
        'DELETE FROM': 'Remove registros de uma tabela.',
        'CREATE TABLE': 'Cria uma nova tabela no banco de dados.',
        'ALTER TABLE': 'Modifica uma tabela existente (adiciona, remove ou modifica colunas).',
        'DROP TABLE': 'Remove uma tabela do banco de dados.',
        'CREATE INDEX': 'Cria um índice em uma tabela para consultas rápidas.',
        GRANT: 'Concede permissões de acesso a usuários no banco de dados.',
        REVOKE: 'Revoga permissões de acesso previamente concedidas.',
    };

    const commandExamples = {
        SELECT: 'SELECT id, nome, email, data_nascimento, nota_matematica, nota_fisica, nota_quimica FROM alunos;',
        'INSERT INTO': 'INSERT INTO alunos (nome, email, data_nascimento, nota_matematica, nota_fisica, nota_quimica) VALUES (\'João\', \'joao@example.com\', \'2000-01-01\', 8.5, 7.2, 9.0);',
        UPDATE: 'UPDATE alunos SET nota_matematica = 9.0 WHERE id = 1;',
        'DELETE FROM': 'DELETE FROM alunos WHERE id = 1;',
        'CREATE TABLE': 'CREATE TABLE alunos (id SERIAL PRIMARY KEY, nome VARCHAR(255) NOT NULL, email VARCHAR(255), data_nascimento DATE, nota_matematica NUMERIC(5,2), nota_fisica NUMERIC(5,2), nota_quimica NUMERIC(5,2));',
        'ALTER TABLE': 'ALTER TABLE alunos ADD COLUMN telefone VARCHAR(20);',
        'DROP TABLE': 'DROP TABLE alunos;',
        'CREATE INDEX': 'CREATE INDEX idx_nome ON alunos (nome);',
        GRANT: 'GRANT SELECT ON alunos TO usuario;',
        REVOKE: 'REVOKE SELECT ON alunos FROM usuario;',
    };
    

    const openModal = (command) => {
        setCurrentCommand(command);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(commandExamples[currentCommand]).then(() => {
            alert('Exemplo copiado para a área de transferência!');
        });
    };

   // Exemplo de função para realizar logout no lado do cliente
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
            window.location.href = '/'; // Ou use navigate do react-router-dom, se estiver usando
        } else {
            throw new Error('Logout failed');
        }
    })
    .catch(error => {
        console.error('Logout error:', error);
        // Lidar com o erro de logout, se necessário
    });
};


    const handleTreinarSQL = () => {
        navigate('/sql');
    };


    const handleHeroInput = () => {
        navigate('/heroinput');
    };

    const handleJsonPlaceHolder = () => {
        navigate('/jsonplaceholder');
    };

    const handleCep = ()=>{
        navigate('/cep');
    };

    return (
        <div className="comandos-container">
            <h1>Principais Comandos SQL</h1>
            <button onClick={handleTreinarSQL}>Treinar SQL</button>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleCep}>Api Via Cep</button>
            <button onClick={handleJsonPlaceHolder}>Api JsonPlaceHolder</button>
            <button onClick={handleHeroInput}>Cardápio</button>
            <div className="comandos-list">
                {Object.keys(commandDescriptions).map((command) => (
                    <div key={command} className="comando" onClick={() => openModal(command)}>
                        <h2>{command}</h2>
                        <p>{commandDescriptions[command]}</p>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={closeModal}>&times;</span>
                        <h2>{currentCommand}</h2>
                        <p>{commandExamples[currentCommand]}</p>
                        <button onClick={copyToClipboard}>Copiar Exemplo</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Comandos;
