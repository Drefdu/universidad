const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require("../models/user");

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.NODE_MAILER_USER,
        pass: process.env.NODE_MAILER_PASS
    }
});

exports.getUser = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Encrypt the password using SHA-1
    const hashedPassword = crypto.createHash('sha1').update(contrasena).digest('hex');
    
    const user = await User.findOne({ correo, pass: hashedPassword });

    if (user) {
        req.session.user = user;
        res.status(200).send("Inicio de sesion correcto")
    } else {
        res.status(500).send("Fallo al iniciar session")
    }

  } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).send('Error interno del servidor');
  }
}

exports.resetPassRequest = async (req, res) => {
    try {
        const { correo } = req.body;
        const token = crypto.randomBytes(20).toString('hex');
        const expirationTime = Date.now() + 3600000; // 1 hora

        const user = await User.findOneAndUpdate(
            { correo },
            { resetPasswordToken: token, resetPasswordExpires: expirationTime },
            { new: true }
        );

        if (!user) {
            return res.status(404).send('El correo electrónico proporcionado no está registrado');
        }

        const resetLink = `http://localhost:${process.env.PORT}/login/restablecer/${token}`;
        const mailOptions = {
            to: correo,
            from: 'your-email@gmail.com',
            subject: 'Restablecimiento de Contraseña',
            text: `Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para restablecerla:\n\n${resetLink}`
        };

        transporter.sendMail(mailOptions, (mailErr) => {
            if (mailErr) {
                console.error('Error al enviar el correo:', mailErr);
                return res.status(500).send('Error al enviar el correo electrónico');
            }
            res.send('Correo de restablecimiento enviado');
        });
    } catch (err) {
        console.error('Error al actualizar el token:', err);
        res.status(500).send('Error interno del servidor');
    }
}

exports.showResetView = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({ 
            resetPasswordToken: token, 
            resetPasswordExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).send('El enlace de restablecimiento es inválido o ha expirado');
        }

        res.render('restablecer', { token });

    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
}

exports.resetPass = async (req, res) => {
    try {
        const { token } = req.params;
        const { nuevaContrasena } = req.body;

        const user = await User.findOne({ 
            resetPasswordToken: token, 
            resetPasswordExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).send('El enlace de restablecimiento es inválido o ha expirado');
        }

        // Encrypt the new password using SHA-1
        const hashedPassword = crypto.createHash('sha1').update(nuevaContrasena).digest('hex');

        user.pass = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.send('Contraseña restablecida correctamente');

    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        res.status(500).send('Error interno del servidor');
    }
}
