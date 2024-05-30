const express = require('express');
const router = express.Router();

app.get('/1', (req, res) => {
  res.render('cursos', { title: 'Cursos' });
});

module.exports = router;
