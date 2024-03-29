const express = require('express');
const { route } = require('express/lib/router');
const adminSiteController = require('../controllers/AdminSiteController');
const reportGenerateController = require("../controllers/ReportGenerateController");

const router = express.Router();

router.get('/', adminSiteController.dashboard);

router.get('/add_schedule', adminSiteController.add_schedule_get);
router.post('/add_schedule', adminSiteController.add_schedule_post);

router.get('/update_schedule', adminSiteController.update_schedule_get);
router.post("/update_schedule", adminSiteController.update_schedule_post);

// add a airport
router.get('/add_airport', adminSiteController.add_airport_get);
router.post('/add_airport', adminSiteController.add_airport_post);


// add a aircraft
router.get('/add_aircraft', adminSiteController.add_aircraft_get);
router.post('/add_aircraft', adminSiteController.add_aircraft_post);


// add a aircrafts for a existing model
router.get('/add_aircraft_ex', adminSiteController.add_aircraft_ex_get);
router.post('/add_aircraft_ex', adminSiteController.add_aircraft_ex_post);

// add a flight
router.get('/add_flight', adminSiteController.add_flight_get);
router.post('/add_flight', adminSiteController.add_flight_post);

// add travel class price 
router.get("/add_price", adminSiteController.add_price_get);
router.post("/add_price", adminSiteController.add_price_post);

// report generation
// Given a flight no, all passengers travelling in it (next immediate flight) below age 18,
// above age 18
router.get("/passenger_details", reportGenerateController.passenger_details_get);
router.post("/passenger_details", reportGenerateController.passenger_details_post);

// Given a date range, number of passengers travelling to a given destination
router.get("/passenger_statistics", reportGenerateController.passenger_statistics_get);
router.post("/passenger_statistics", reportGenerateController.passenger_statistics_post);

// Given a date range, number of bookings by each passenger type
router.get("/booking_statistics", reportGenerateController.booking_statistics_get);
router.post("/booking_statistics", reportGenerateController.booking_statistics_post);

// Given origin and destination, all past flights, states, passenger counts data
router.get("/flight_statistics", reportGenerateController.flight_statistics_get);
router.post("/flight_statistics", reportGenerateController.flight_statistics_post);

// Total revenue generated by each Aircraft type
router.get("/revenue_details", reportGenerateController.revenue_details_get);
// router.post("/revenue_details", reportGenerateController.revenue_details_post);

module.exports = router;