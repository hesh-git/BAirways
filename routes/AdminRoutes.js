const express = require('express');
const adminSiteController = require('../controllers/AdminSiteController');

const router = express.Router();

router.get('/', adminSiteController.dashboard);

router.get('/add_schedule', adminSiteController.add_schedule_get);

router.get('/add_airport', adminSiteController.add_airport_get);


// add a aircraft
router.get('/add_aircraft', adminSiteController.add_aircraft_get);

router.post('/add_aircraft', adminSiteController.add_aircraft_post);


// add a flight
router.get('/add_flight');

module.exports = router;