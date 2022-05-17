const express = require('express');

const router = express.Router();

router.get('/passengerDetails', (req, res) =>{
    res.render('PassengerDetails', {title: 'PassengerDetails'})
});

module.exports = router;