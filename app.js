const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const database = require('./config/database');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const { createServer } = require('http');

const server = createServer(app);
const io = new Server(server);

const port = process.env.PORT;
require('dotenv').config();

database();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Rutas

app.use('/login', require('./routes/login'));
app.use('/registro', require('./routes/registro'));
app.use('/', require('./routes/home'))
app.use('/index', require('./routes/home'))
app.use('/chat', require('./routes/chat'));

app.get('/avisos', (req, res) => { 
    const user = req.session.user || null;
    res.render('avisos', { user });
})
app.get('/cursos', (req, res) => { 
    const user = req.session.user || null;
    res.render('cursos', { user });
});
app.get('/contacto', (req, res) => { 
    const user = req.session.user || null;
    res.render('contacto', { user });
});

// Iniciar el servidor
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    }); 
});
  
server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});