const express = require('express');
const { route } = require('express/lib/router');
const adminSiteController = require('../controllers/AdminSiteController');

const router = express.Router();

router.get('/', adminSiteController.dashboard);

router.get('/add_schedule', adminSiteController.add_schedule_get);

// add a airport
router.get('/add_airport', adminSiteController.add_airport_get);
router.post('/add_airport', adminSiteController.add_airport_post);


// add a aircraft
router.get('/add_aircraft', adminSiteController.add_aircraft_get);
router.post('/add_aircraft', adminSiteController.add_aircraft_post);


// add a flight
router.get('/add_flight');

module.exports = router;