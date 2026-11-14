var express = require('express');
var router = express.Router();
var controller = require('../controllers/about');

/* GET about page (mounted at /about in app.js). */
router.get('/', controller.about);

module.exports = router;
