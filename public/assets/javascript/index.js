const express = require('express');
const path = require('path');

const PORT = 4000;
const app = express();

// Ruta estática para servir archivos HTML desde el directorio 'public'
app.use(express.static(path.join(__dirname, './')));

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
