const express = require('express');
const path = require('path');
const { Server } = require('socket.io');
const { createServer } = require('http');

const port = process.env.PORT || 3000; 

const app = express();
const server = createServer(app);
const io = new Server(server);


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/', require('./routes/home'));
app.use('/index', require('./routes/home'));
app.get('/chat', (req, res) => { res.render('chat') });
app.get('/avisos', (req, res) => { res.render('avisos') });
app.get('/cursos', (req, res) => { res.render('cursos') });
app.get('/contacto', (req, res) => { res.render('contacto'); });


io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});