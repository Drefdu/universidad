const express = require('express');
const router = express.Router();
const controller = require('../controllers/chat');


router.get('/', controller.getUsers);
router.get('/:userId', controller.getUser);
router.get('/messages/:userId', controller.getMessages);
router.post('/messages/', controller.addMessage);


module.exports = router;