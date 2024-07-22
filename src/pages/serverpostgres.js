const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');


const app = express();
const port = 5000;
const secretKey = 'mysecretkey'; // Chave secreta para assinar o token JWT

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sqlaprender',
    password: 'admin',
    port: 5432,
});

app.post('/api/login', async (req, res) => {
    const { login, senha } = req.body;

    if (!senha) {
        return res.status(400).send('Password cannot be empty/Login e Senha nao pode ser nulo');
    }

    try {
        const result = await pool.query('SELECT * FROM login WHERE login = $1 AND senha = $2', [login, senha]);
        if (result.rows.length > 0) {
            const token = jwt.sign({ login }, secretKey, { expiresIn: '1h' }); // Gerar token com expiração de 1 hora

            // Armazenar token na tabela login
            await pool.query('UPDATE login SET token = $1 WHERE id = $2', [token, result.rows[0].id]);

            res.status(200).json({ token });
        } else {
            res.status(401).send('Invalid credentials/Credenciais Inválidas');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Endpoint de logout
app.post('/api/logout', async (req, res) => {
    try {
        const { userId } = req.body;

        // Limpar token na tabela login (definindo como NULL)
        await pool.query('UPDATE login SET token = NULL WHERE id = $1', [userId]);

        res.status(200).send('Logout successful/Logout com sucesso');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});



app.post('/api/execute-sql', async (req, res) => {
    const { sql } = req.body;

   
    try {
        const result = await pool.query(sql);

        if (sql.trim().toUpperCase().startsWith('SELECT')) {
            res.json(result.rows);
        } else {
            // Se não for um SELECT, retornar dados de exemplo (como 'alunos')
            const alunosResult = await pool.query('SELECT * FROM alunos');
            res.json(alunosResult.rows);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
