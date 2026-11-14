var express = require('express');
var router = express.Router();
var controller = require('../controllers/news');

/* GET news page (mounted at /news in app.js). */
router.get('/', controller.news);

module.exports = router;
