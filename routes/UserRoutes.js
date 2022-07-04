const express = require('express');
const { route } = require('express/lib/router');
const userSiteController = require('../controllers/UserSiteController');

const router = express.Router();

router.get('/profile', userSiteController.view_profile_get);

router.get('/', userSiteController.view_dashboard_get);

// router.get('/editProfile', userSiteController.view_edit_profile_post);

router.get('/editProfile', userSiteController.view_edit_profile_get);



module.exports = router;