const express = require('express');
const adminSiteController = require('../controllers/AdminSiteController');

const router = express.Router();

router.get('/', adminSiteController.dashboard);

router.get('/add-schedule', adminSiteController.add_schedule_get);

router.get('/add-airport', adminSiteController.add_airport_get);

router.get('/add-aircraft', adminSiteController.add_aircraft_get);

router.post('/add-aircraft', adminSiteController.add_aircraft_post);

module.exports = router;