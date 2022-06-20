const Booking = require("../models/Booking");

const add_passenger_details_get = (req, res) => {
    res.render('passengerDetails', {title: 'PassengerDetails', layout: './layouts/layout', no_adults: 1, no_children: 1,  flight_shedule_id:1});
}

const add_passenger_details_post = (req, res) => {
    const data = req.body;
    const dbCon = req.dbCon;

    const no_adults = 1;
    const no_children = 1;
    const FlightScheduleID = 1;
    const TravellerID = 1;
    const TravelClassID = 1;
    const BookingStateID = 1;

    Booking.addBooking(FlightScheduleID, TravellerID, TravelClassID,BookingStateID, dbCon, function(err, result, fileld){
        if(err)
            throw err
        const BookingID = result.insertId;

        for (let i=0; i < no_adults; i++){
            let Gender = data['GenderP'+i];
            let DateOfBirth = data['DateOfBirthP'+i];
            let FirstName = data['FirstNameP'+i];
            let LastName = data['LastNameP'+i];
            Booking.addPassenger(BookingID, 1, Gender, FirstName, LastName, DateOfBirth, dbCon, function (err, result, fields){
                if(err)
                    throw err
            })
        }

        for (let i=0; i < no_children; i++){
            let Gender = data['GenderC'+i];
            let DateOfBirth = data['DateOfBirthC'+i];
            let FirstName = data['FirstNameC'+i];
            let LastName = data['LastNameC'+i];
            Booking.addPassenger(BookingID, 2, Gender, FirstName, LastName, DateOfBirth, dbCon, function (err, result, fields){
                if(err)
                    throw err
                
            })
        }

        res.send('Passengers Added');

    })

    
    
}

const add_guest_details_get = (req, res) => {
    res.render('guestDetails', {title: 'GuestDetails', layout: './layouts/layout',no_adults: 1, no_children: 0, flight_shedule_id:1});
}

const add_guest_details_post =(req, res) => {
    const data = req.body;
    const dbCon = req.dbCon;

    const no_adults = 1;
    const no_children = 0;
    const FlightScheduleID = 1;
    const TravelClassID = 1;
    const BookingStateID = 1;

    Booking.addTraveller(dbCon, function(err, result, fileld){
        if(err)
            throw err
        
        const TravellerID = result.insertId;

        Booking.addGuest(TravellerID, data['FirstName'], data['LastName'], data['Email'], data['ContactNumber'], dbCon, function(err, result, fields){
            if (err)
                throw err    
        })

        Booking.addBooking(FlightScheduleID, TravellerID, TravelClassID,BookingStateID, dbCon, function(err, result, fileld){
            if(err)
                throw err
            const BookingID = result.insertId;
    
            for (let i=0; i < no_adults; i++){
                let Gender = data['GenderP'+i];
                let DateOfBirth = data['DateOfBirthP'+i];
                let FirstName = data['FirstNameP'+i];
                let LastName = data['LastNameP'+i];
                Booking.addPassenger(BookingID, 1, Gender, FirstName, LastName, DateOfBirth, dbCon, function (err, result, fields){
                    if(err)
                        throw err
                })
            }
    
            for (let i=0; i < no_children; i++){
                let Gender = data['GenderC'+i];
                let DateOfBirth = data['DateOfBirthC'+i];
                let FirstName = data['FirstNameC'+i];
                let LastName = data['LastNameC'+i];
                Booking.addPassenger(BookingID, 2, Gender, FirstName, LastName, DateOfBirth, dbCon, function (err, result, fields){
                    if(err)
                        throw err
                    
                })
            }
    
            res.send('Guest Details Added');
    
        })
    })

}


const select_seat_get = (req, res) => {
    const dbCon = req.dbCon;
    const ScheduleId = 3;
    const TravelClassId = 1;
    
    Booking.getCapacitybyTravelClass(ScheduleId, TravelClassId, dbCon, (err, seatCapacity, fields) => {
        const seat_cap = {};
    
        // seatCapacity.forEach((value, index, array) => {
        //     seat_cap.NumRows = value.NumRows;
        //     seat_cap.NumCols = value.NumCols;
        // });

        seat_cap[0] = seatCapacity[0]["NumRows"];
        seat_cap[1] = seatCapacity[0]["NumCols"];

        // Booking.getSeats(ScheduleId, dbCon, (err, seatStates, fields) => {

        //     const eco_booked_seats = [];
        //     const busi_booked_seats = [];
        //     const plat_booked_seats =[];

        //     seatStates.forEach((value, index, array) => {
        //         if(value["SeatStateID"] == 3) { // only booked seats
        //             if(value["TravelClassID"] == 1){
        //                 eco_booked_seats.push(value.SeatNo);
        //             } else if(value["TravelClassID"] == 2){
        //                 busi_booked_seats.push(value.SeatNo);
        //             } else if(value["TravelClassID"] == 3){
        //                 plat_booked_seats.push(value.SeatNo);
        //             }        
        //         }
                
        //     })

        //     console.log(seat_cap);
        //     res.render('seatSelection', {title: 'Seat Selection', layout: './layouts/seat_select_layout', seat_cap: seat_cap, eco_booked_seats: eco_booked_seats, busi_booked_seats: busi_booked_seats, plat_booked_seats: plat_booked_seats});
            
            
        // });

        Booking.getSeatsbyTravelClass(ScheduleId, TravelClassId, dbCon, (err, seatStates, fields) => {

            const booked_seats = [];

            seatStates.forEach((value, index, array) => {
                if(value["SeatStateID"] == 3) { // only booked seats
                    booked_seats.push(value.SeatNo);    
                }
                
            })
            console.log(booked_seats);

            res.render('seatSelection', {title: 'Seat Selection', layout: './layouts/seat_select_layout', seat_cap: seat_cap, booked_seats: booked_seats});
            
            
        });
        


    })
}

const add_payment_get =(req, res ) => {
    res.render('payment', {title: 'Payment', layout: './layouts/payment_layout'});
}

const before_payment_get = (req, res) => {
    res.render('beforePayment', {title: 'Payment', layout: './layouts/payment_layout'})

}


module.exports ={
    add_passenger_details_get,
    add_passenger_details_post,
    add_guest_details_get,
    add_guest_details_post,
    select_seat_get,
    add_payment_get,
    before_payment_get,
}