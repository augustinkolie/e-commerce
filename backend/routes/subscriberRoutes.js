const express = require('express');
const router = express.Router();
const { subscribeToNewsletter } = require('../controllers/subscriberController.js');

router.post('/', subscribeToNewsletter);

module.exports = router;
