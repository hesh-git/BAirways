const Passenger = require("../models/Booking");

const add_passenger_details_get = (req, res) => {
    res.render('passengerDetails', {title: 'PassengerDetails'});
}

const add_passenger_details_post = (req, res) => {
    const data = req.body;
    const dbCon = req.dbCon;

    console.log(data);

    Passenger.save(data, dbCon, (err, result, fields) => {
        if(err) throw err;
        res.redirect('/passengerDetails');
    });
}


module.exports ={
    add_passenger_details_get,
    add_passenger_details_post
}