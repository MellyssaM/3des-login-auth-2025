const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'supersecretjwtkey';

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname)));

const users = [
    { id: 1, email: 'user@example.com', password: 'password123', name: 'Fulano da Silva' }
];

const posts = [
    { id: 1, title: 'Generativa', content: 'Um guia simples sobre o que é IA generativa e como ela funciona.', date: '2025-04-30', likes: 1576, views: 312 },
    { id: 2, title: '5 hábitos saudáveis para adotar ainda hoje', content: 'Pequenas mudanças de rotina que trazem grandes resultados.', date: '2025-04-14', likes: 842, views: 120 },
    { id: 3, title: 'Guia básico de investimentos para iniciantes', content: 'O que você precisa saber antes de começar a investir.', date: '2025-04-29', likes: 1340, views: 198 }
];

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Credenciais inválidas' });
    }
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});