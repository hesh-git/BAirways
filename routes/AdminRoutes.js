const express = require('express');
const adminSiteController = require('../controllers/AdminSiteController');

const router = express.Router();

router.get('/', adminSiteController.dashboard);

router.get('/add-schedule', adminSiteController.add_schedule);

module.exports = router;