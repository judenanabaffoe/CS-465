var express = require('express');
var router = express.Router();
var controller = require('../controllers/rooms');

/* GET rooms page (mounted at /rooms in app.js). */
router.get('/', controller.rooms);

module.exports = router;
