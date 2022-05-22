const Passenger = require("../models/Booking");

const add_passenger_details_get = (req, res) => {
    res.render('passengerDetails', {title: 'PassengerDetails', no_children: 3, no_adults: 2, flight_shedule_id:1});
}

const add_passenger_details_post = (req, res) => {
    const data = req.body;
    const dbCon = req.dbCon;

    const no_adults = 2;
    const no_children = 3;
    const FlightScheduleID = 1;
    const TravellerID = 1;
    const TravelClassID = 1;
    const BookingStateID = 1;

    Passenger.addBooking(FlightScheduleID, TravellerID, TravelClassID,BookingStateID, dbCon, function(err, result, fileld){
        if(err)
            throw err
        const BookingID = result.insertId;

        for (let i=0; i < no_adults; i++){
            let Gender = data['GenderP'+i];
            let DateOfBirth = data['DateOfBirthP'+i];
            let FirstName = data['FirstNameP'+i];
            let LastName = data['LastNameP'+i];
            Passenger.addPassenger(BookingID, 1, Gender, FirstName, LastName, DateOfBirth, dbCon, function (err, result, fields){
                if(err)
                    throw err
            })
        }

        for (let i=0; i < no_children; i++){
            let Gender = data['GenderC'+i];
            let DateOfBirth = data['DateOfBirthC'+i];
            let FirstName = data['FirstNameC'+i];
            let LastName = data['LastNameC'+i];
            Passenger.addPassenger(BookingID, 2, Gender, FirstName, LastName, DateOfBirth, dbCon, function (err, result, fields){
                if(err)
                    throw err
                
            })
        }

        res.send('Passengers Added');

    })

    
    
}

const add_guest_details_get = (req, res) => {
    res.render('passengerDetails', {title: 'GuestDetails', no_children: 3, no_adults: 2, flight_shedule_id:1});
}

module.exports ={
    add_passenger_details_get,
    add_passenger_details_post,
    add_guest_details_get
}