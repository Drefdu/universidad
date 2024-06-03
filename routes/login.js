const express = require('express');
const router = express.Router();
const controller = require('../controllers/login');


router.get('/', (req, res) => { res.render('login')});
router.post('/', controller.getUser);
router.get('/recuperarRequest', (req, res) => { res.render('solicitar-restablecimiento') });
router.post('/recuperarRequest', controller.resetPassRequest);
router.get('/restablecer/:token', controller.showResetView);
router.post('/restablecer/:token', controller.resetPass);



module.exports = router;


