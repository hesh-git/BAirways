const express = require('express');
const { route } = require('express/lib/router');
const BookingController = require('../controllers/BookingController');
const router = express.Router();

router.get('/add-passengers', BookingController.add_pass_details_get);

// router.get('/passengerDetails', BookingController.add_passenger_details_get);
router.post('/passengerDetails', BookingController.add_passenger_details_post);

// router.get('/guestDetails', BookingController.add_guest_details_get);
router.post('/guestDetails', BookingController.add_guest_details_post);

router.get('/seat-selection', BookingController.select_seat_get);
router.post('/seat-selection', BookingController.select_seat_post);

router.get('/payment', BookingController.add_payment_get);
// router.post('/payment', BookingController.add_payment_post);

router.get('/beforePayment', BookingController.before_payment_get);
router.post('/beforePayment', BookingController.before_payment_post);

router.get('/success', BookingController.success_get);
module.exports = router;