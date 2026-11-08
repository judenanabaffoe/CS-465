var express = require('express');
var router = express.Router();
var controller = require('../controllers/travel');

/* GET travel page. Mounted at /travel in app.js, so '/' here is /travel. */
router.get('/', controller.travel);

module.exports = router;
