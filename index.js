const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4000;

const server = http.createServer((req, res) => {
  // Manejando la solicitud de la ruta raíz
  if (req.url === '/' || req.url === '/index.html') {
    // Lee el archivo index.html
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        // Si hay un error, envía una respuesta de error
        res.writeHead(500);
        res.end('Error interno del servidor');
      } else {
        // Si se lee correctamente, envía el contenido del archivo como respuesta
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else {
    // Si la ruta no es la raíz, devuelve un error 404
    res.writeHead(404);
    res.end('Página no encontrada');
  }
});

// Escuchando en el puerto 4000
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
