const express = require('express');
const searchFlightController = require('../controllers/searchFlightController');
const flightSheduleTimeTableController = require('../controllers/flightSheduleTimeTableController');

const router = express.Router();

router.get('/searchFlight', searchFlightController.searchFlight_get);
router.post('/searchFlight', searchFlightController.searchFlight_post);

router.get('/flightTimeTable', flightSheduleTimeTableController.flightTimeTable_get);


module.exports = {
    routes : router
}