var express = require('express');
var router = express.Router();
var controller = require('../controllers/meals');

/* GET meals page (mounted at /meals in app.js). */
router.get('/', controller.meals);

module.exports = router;
