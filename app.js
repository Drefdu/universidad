const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const mysql = require('mysql');
const validator = require("node-email-validation");
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '102814tony',
    database: 'web'
});

connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
});

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: 'tonyestrada658@gmail.com',
      pass: 'vljo emmm eejl wxlm'
  }
});

app.get('/registro', (req, res) => {
    res.render('registro');
});

app.post('/registro', (req, res) => {
    const { newusuario, newcorreo, contrasena } = req.body;

    if (!validator.is_email_valid(newcorreo)) {
        console.log('Correo inválido');
        res.status(400).send('El correo no es válido');
        return;
    }

    const checkEmailQuery = 'SELECT COUNT(*) AS count FROM usuarios WHERE correo = ?';
    connection.query(checkEmailQuery, [newcorreo], (err, emailResult) => {
        if (err) {
            console.error('Error al verificar correo:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        const emailExists = emailResult[0].count > 0;
        if (emailExists) {
            console.log('Correo ya registrado');
            res.status(400).send('El correo ya está registrado');
            return;
        }

        const hashedPassword = crypto.createHash('sha1').update(contrasena).digest('hex');

        const insertUserQuery = 'INSERT INTO usuarios (usuario, correo, pass, rol) VALUES (?, ?, ?, ?)';
        const values = [newusuario, newcorreo, hashedPassword, 'usuario'];



// Manejar errores 404
app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Página no encontrada' });
  });
  
  // Manejar errores 500
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500', { title: 'Error interno del servidor' });
  });
  

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
