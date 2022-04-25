const express = require('express');
const loginSiteController = require('../controllers/LoginSiteController');

const router = express.Router();

router.get('/', loginSiteController.login_page);

module.exports = router;