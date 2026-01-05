const express = require('express');
const { chatWithAI } = require('../controllers/chatController.js');

const router = express.Router();

router.post('/', chatWithAI);

module.exports = router;
