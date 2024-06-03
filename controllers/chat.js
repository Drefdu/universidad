const User = require("../models/user");
const Messages = require("../models/message");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    const user = req.session.user || null;
    res.render('chat', { user, users });
    
  } catch (error) {
    console.log(error)
    return res.status(500).send('Error interno del servidor')
  }
}

exports.getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(201).send("No se encontro el usuario");
    }
    return res.status(200).json(user)
    
  } catch (error) {
    console.log(error)
    return res.status(500).send('Error interno del servidor')
  }
}


exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const messages = await Messages.findOne({ usuarioId: userId });

    if (!messages) {
      return res.status(201).send("No se encontraron mensajes para el usuario seleccionado");
    }

    return res.status(200).json(messages);

  } catch (error) {
    console.error(error);
    return res.status(500).send('Error interno del servidor');
  }
}

exports.addMessage = async (req, res) => {
  try {
    const { userId, messageContent, senderId } = req.body;

    // Buscar si existen mensajes para el usuario
    let userMessages = await Messages.findOne({ usuarioId: userId });

    // Si no existen, crear un nuevo registro de mensajes
    if (!userMessages) {
      userMessages = new Messages({ usuarioId: userId });
    }

    // Agregar el nuevo mensaje al array de mensajes del usuario
    userMessages.messages.push({
      content: messageContent,
      watched: false, // Podrías establecerlo en true si deseas
      sender: senderId
    });

    // Guardar los cambios en la base de datos
    await userMessages.save();
    
    console.log('Mensaje agregado correctamente');
    return res.status(200).send('Mensaje agregado correctamente');

  } catch (error) {
    console.error('Error al agregar mensaje:', error);
    return res.status(500).send('Error interno del servidor');
  }
}



