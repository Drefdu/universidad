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

        connection.query(insertUserQuery, values, (insertErr, result) => {
            if (insertErr) {
                console.error('Error al insertar usuario:', insertErr);
                res.status(500).send('Error interno del servidor');
                return;
            }
            console.log('Usuario insertado correctamente');
            res.redirect('/login');
        });
    });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Iniciar Sesión' });
});

app.post('/login', (req, res) => {
    const { correo, contrasena } = req.body;

    const hashedPassword = crypto.createHash('sha1').update(contrasena).digest('hex');

    const sql = 'SELECT * FROM usuarios WHERE correo = ? AND pass = ?';
    const values = [correo, hashedPassword];

    connection.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        if (results.length > 0) {
            req.session.user = results[0];
            res.redirect('/index');
        } else {
            res.render('login', { title: 'Iniciar Sesión', error: 'Usuario o contraseña incorrectos' });
        }
    });
});

app.get('/solicitar-restablecimiento', (req, res) => {
    res.render('solicitar-restablecimiento');
});

app.post('/solicitar-restablecimiento', (req, res) => {
    const { correo } = req.body;

    // Generar token único
    const token = crypto.randomBytes(20).toString('hex');
    const expirationTime = Date.now() + 3600000; // 1 hora

    const updateTokenQuery = 'UPDATE usuarios SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE correo = ?';
    connection.query(updateTokenQuery, [token, expirationTime, correo], (err, result) => {
        if (err) {
            console.error('Error al actualizar el token:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        const resetLink = `http://localhost:${port}/restablecer/${token}`;
        const mailOptions = {
            to: correo,
            from: 'your-email@gmail.com',
            subject: 'Restablecimiento de Contraseña',
            text: `Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para restablecerla:\n\n${resetLink}`
        };

        transporter.sendMail(mailOptions, (mailErr) => {
            if (mailErr) {
                console.error('Error al enviar el correo:', mailErr);
                res.status(500).send('Error al enviar el correo electrónico');
                return;
            }
            res.send('Correo de restablecimiento enviado');
        });
    });
});

app.get('/restablecer/:token', (req, res) => {
    const { token } = req.params;

    const checkTokenQuery = 'SELECT * FROM usuarios WHERE resetPasswordToken = ? AND resetPasswordExpires > ?';
    connection.query(checkTokenQuery, [token, Date.now()], (err, result) => {
        if (err || result.length === 0) {
            console.error('Token inválido o expirado');
            res.status(400).send('El enlace de restablecimiento es inválido o ha expirado');
            return;
        }
        res.render('restablecer', { token });
    });
});

app.post('/restablecer/:token', (req, res) => {
    const { token } = req.params;
    const { nuevaContrasena } = req.body;

    const checkTokenQuery = 'SELECT * FROM usuarios WHERE resetPasswordToken = ? AND resetPasswordExpires > ?';
    connection.query(checkTokenQuery, [token, Date.now()], (err, result) => {
        if (err || result.length === 0) {
            console.error('Token inválido o expirado');
            res.status(400).send('El enlace de restablecimiento es inválido o ha expirado');
            return;
        }

        
        const hashedPassword = crypto.createHash('sha1').update(nuevaContrasena).digest('hex');

        const updatePasswordQuery = 'UPDATE usuarios SET pass = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE resetPasswordToken = ?';
        connection.query(updatePasswordQuery, [hashedPassword, token], (updateErr) => {
            if (updateErr) {
                console.error('Error al actualizar la contraseña:', updateErr);
                res.status(500).send('Error interno del servidor');
                return;
            }
            res.send('Contraseña restablecida correctamente');
        });
    });
});

app.get('/index', (req, res) => {
    const user = req.session.user || null;
    console.log(user);
    res.render('index', { user });
});

app.get('/avisos', (req, res) => {
    res.render('avisos', { title: 'Noticias' });
});

app.get('/cursos', (req, res) => {
    res.render('cursos', { title: 'Cursos' });
});

app.get('/contacto', (req, res) => {
    res.render('contacto', { title: 'Contacto' });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
