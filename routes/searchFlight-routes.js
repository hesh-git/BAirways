const express = require('express');
const searchFlightController = require('../controllers/searchFlightController');
const { check, validationResult } = require("express-validator");
const flightSheduleTimeTableController = require('../controllers/flightSheduleTimeTableController');
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });


const router = express.Router();

router.get('/searchFlight', searchFlightController.searchFlight_get);
router.post('/searchFlight',
urlencodedParser,
    [
        check("departing", "Select Your Departure Date").exists(),

    ],
    searchFlightController.searchFlight_post);

router.get('/flightTimeTable', flightSheduleTimeTableController.flightTimeTable_get);


module.exports = {
    routes : router
}