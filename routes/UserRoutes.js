const express = require('express');
const { route } = require('express/lib/router');
const userSiteController = require('../controllers/UserSiteController');

const router = express.Router();

router.get('/profile', userSiteController.view_profile_get);

router.get('/dashboard', userSiteController.view_dashboard_get);

module.exports = router;