const User = require("../models/user");
const validator = require("node-email-validation");
const crypto = require('crypto');

exports.addUser = async (req, res) => {
  try {
      const { newusuario, newcorreo, contrasena } = req.body;
      const existingUser = await User.findOne({ correo: newcorreo });

      if (!validator.is_email_valid(newcorreo)) {
        return res.status(500).send('El correo no es válido.');
      }

      if (existingUser) {
        return res.status(500).send('El correo ya está registrado.');
      }

      const hashedPassword = crypto.createHash('sha1').update(contrasena).digest('hex');

      const newUser = new User({
          usuario: newusuario,
          correo: newcorreo,
          pass: hashedPassword,
          rol: 'usuario'
      });

      await newUser.save();

      return res.status(200).send('Usuario Registrado exitosamente');

  } catch (err) {
      console.error('Error al insertar usuario:', err);
      res.status(500).send('Error interno del servidor');
  }
}
