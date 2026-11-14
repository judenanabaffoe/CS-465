var express = require('express');
var router = express.Router();
var controller = require('../controllers/contact');

/* GET contact page, POST contact form (mounted at /contact in app.js). */
router.get('/', controller.contact);
router.post('/', controller.send);

module.exports = router;
