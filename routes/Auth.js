const express = require('express');
const loginSiteController = require('../controllers/LoginSiteController');


const router = express.Router();

//GET requests
router.get('/', loginSiteController.login_page);

router.get('/register', loginSiteController.signup_page);

//POST request
router.post('/auth_login', loginSiteController.login_post);

module.exports = router;