const express = require('express');
const { route } = require('express/lib/router');
const adminSiteController = require('../controllers/AdminSiteController');

const router = express.Router();

router.get('/', adminSiteController.dashboard);

router.get('/add_schedule', adminSiteController.add_schedule_get);
router.post('/add_schedule', adminSiteController.add_schedule_post);

// add a airport
router.get('/add_airport', adminSiteController.add_airport_get);
router.post('/add_airport', adminSiteController.add_airport_post);


// add a aircraft
router.get('/add_aircraft', adminSiteController.add_aircraft_get);
router.post('/add_aircraft', adminSiteController.add_aircraft_post);


// add a flight
router.get('/add_flight', adminSiteController.add_flight_get);
router.post('/add_flight', adminSiteController.add_flight_post);

// add travel class price 
router.get("/add_price", adminSiteController.add_price_get);
router.post("/add_price", adminSiteController.add_price_post);

module.exports = router;