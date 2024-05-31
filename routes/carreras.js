const express = require('express');
const router = express.Router();

router.get('/cursos', (req, res) => {
  res.render('cursos', { title: 'Cursos' });
});

module.exports = router;
