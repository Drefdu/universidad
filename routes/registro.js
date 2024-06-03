const express = require('express');
const router = express.Router();
const controller = require('../controllers/registro');


router.get('/', (req, res) => { res.render('registro')});
router.post('/', controller.addUser);

module.exports = router;