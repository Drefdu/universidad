const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const mysql = require('mysql');

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

app.get('/registro', (req, res) => {
    res.render('registro');
});

app.post('/registro', (req, res) => {
  const { newusuario, newcorreo, contrasena } = req.body;

  // Primero, verifica si el correo ya está registrado
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

      // Si el correo no está registrado, procede con la inserción del usuario
      const insertUserQuery = 'INSERT INTO usuarios (usuario, correo, pass, rol) VALUES (?, ?, ?, ?)';
      const values = [newusuario, newcorreo, contrasena, 'usuario'];

      connection.query(insertUserQuery, values, (insertErr, result) => {
          if (insertErr) {
              console.error('Error al insertar usuario:', insertErr);
              res.status(500).send('Error interno del servidor');
              return;
          }
          console.log('Usuario insertado correctamente');
          res.redirect('/login'); // Redirecciona a la página de inicio de sesión
      });
  });
});



app.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;

  const sql = 'SELECT * FROM usuarios WHERE correo = ? AND pass = ?';
  const values = [correo, contrasena];

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




app.use('/', require('./routes/home'));
app.use('/index', require('./routes/home'));


app.get('/', (req, res) => {
  res.render('index', { user: req.user });
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

app.get('/login', (req, res) => {
  res.render('login', { title: 'Iniciar Sesión' });
});


app.get('/registro', (req, res) => {
  res.render('registro');
});

app.get('/index', (req, res) => {
  if (!req.session.user) {
      res.redirect('/login');
      return;
  }

  const user = req.session.user;
  console.log(user); 
  res.render('index', { user });
});




// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
