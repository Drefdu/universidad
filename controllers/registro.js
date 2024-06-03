
const User = require("../models/user");
const validator = require("node-email-validation");

exports.addUser = async (req, res) => {
  try {
    
      const { newusuario, newcorreo, contrasena } = req.body;
      const existingUser = await User.findOne({ correo: newcorreo });

      if (!validator.is_email_valid(newcorreo)) {
        return res.status(500).send('El correo no es válido.') 
      }

      if (existingUser) {
        return res.status(500).send('El correo ya está registrado.')  
      }

      const newUser = new User({
          usuario: newusuario,
          correo: newcorreo,
          pass: contrasena,
          rol: 'usuario'
      });

      await newUser.save();

      return res.status(200).send('Usuario Registrado exitosamente');
      
      // res.redirect('/login');

  } catch (err) {
      console.error('Error al insertar usuario:', err);
      res.status(500).send('Error interno del servidor');
  }  
}

