const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const port = 5000;
const secretKey = 'mysecretkey'; // Chave secreta para assinar o token JWT

app.use(cors());
app.use(bodyParser.json());

// Conectar ao banco de dados SQLite
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite');

        // Criar tabelas se não existirem
        db.run(`CREATE TABLE IF NOT EXISTS login (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            login TEXT,
            senha TEXT,
            token TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS alunos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT,
            data_nascimento DATE,
            nota_matematica NUMERIC(5,2),
            nota_fisica NUMERIC(5,2),
            nota_quimica NUMERIC(5,2)
        )`);

        // Inserir dados fictícios na tabela login
        db.get(`SELECT * FROM login LIMIT 1`, async (err, row) => {
            if (!row) {
                const insertLogin = 'INSERT INTO login (login, senha) VALUES (?, ?)';
                db.run(insertLogin, ['admin', 'admin']); 
               
                console.log('Dados fictícios inseridos na tabela login');
            }
        });

        // Inserir dados fictícios na tabela alunos
        db.get(`SELECT * FROM alunos LIMIT 1`, async (err, row) => {
            if (!row) {
                const insertAlunos = 'INSERT INTO alunos (nome, email, data_nascimento, nota_matematica, nota_fisica, nota_quimica) VALUES (?, ?, ?, ?, ?, ?)';
                db.run(insertAlunos, ['João', 'joao@example.com', '1995-10-15', 8.5, 7.0, 9.0]);
                db.run(insertAlunos, ['Maria', 'maria@example.com', '1998-04-23', 9.0, 8.5, 7.5]);
                console.log('Dados fictícios inseridos na tabela alunos');
            }
        });
    }
});

// Endpoint de login
app.post('/api/login', async (req, res) => {
    const { login, senha } = req.body;

    try {
        const sql = 'SELECT * FROM login WHERE login = ? AND senha = ?';
        db.get(sql, [login, senha], async (err, row) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Erro no servidor');
            }

            if (row) {
                const token = jwt.sign({ login }, secretKey, { expiresIn: '1h' });

                // Atualizar token na tabela login
                const updateSql = 'UPDATE login SET token = ? WHERE id = ?';
                db.run(updateSql, [token, row.id], (err) => {
                    if (err) {
                        console.error(err.message);
                        return res.status(500).send('Erro ao atualizar token');
                    }
                    res.status(200).json({ token });
                });
            } else {
                res.status(401).send('Credenciais inválidas');
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro no servidor');
    }
});

// Endpoint de logout
app.post('/api/logout', async (req, res) => {
    try {
        const { userId } = req.body;

        // Limpar token na tabela login (definindo como NULL)
        const updateSql = 'UPDATE login SET token = NULL WHERE id = ?';
        db.run(updateSql, [userId], (err) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Erro ao fazer logout');
            }
            res.status(200).send('Logout com sucesso');
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro no servidor');
    }
});

// Endpoint para executar SQL genérico
app.post('/api/execute-sql', async (req, res) => {
    const { sql } = req.body;

    try {
        // Executar a consulta SQL fornecida no corpo da requisição
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Erro ao executar consulta SQL');
            }

            // Executar o SQL: SELECT * FROM alunos
            db.all('SELECT * FROM alunos', [], (err, alunos) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).send('Erro ao buscar alunos');
                }

                // Enviar resposta com os resultados da consulta de alunos
                res.json(alunos);
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro no servidor');
    }
});


// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
