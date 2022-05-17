const express = require('express');
const { route } = require('express/lib/router');
const BookingController = require('../controllers/BookingController')
const router = express.Router();

router.get('/passengerDetails', BookingController.add_passenger_details_get);
router.post('/passengerDetails', BookingController.add_passenger_details_post);

module.exports = router;