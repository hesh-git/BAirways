const Booking = require("../models/Booking");

const add_passenger_details_get = (req, res) => {
    res.render('passengerDetails', {title: 'PassengerDetails', layout: './layouts/layout', no_adults: 1, no_children: 1,  flight_shedule_id:1});
}

const add_passenger_details_post = (req, res) => {
    const data = req.body;
    const dbCon = req.dbCon;

    const no_adults = 1;
    const no_children = 1;
    const NumPassengers = no_adults + no_children;
    const FlightScheduleID = 1;
    const TravellerID = 1;
    const TravelClassID = 1;
    const BookingStateID = 1;

    Booking.addBooking(FlightScheduleID, TravellerID, TravelClassID,BookingStateID, NumPassengers, dbCon, function(err, result, fileld){
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

        res.redirect("/seat-selection");

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
    const NumPassengers = no_adults + no_children;
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

        Booking.addBooking(FlightScheduleID, TravellerID, TravelClassID,BookingStateID,NumPassengers, dbCon, function(err, result, fileld){
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
    
            res.redirect("/seat-selection");
    
        })
    })

}


const select_seat_get = (req, res) => {
    const dbCon = req.dbCon;
    const ScheduleId = 7;
    const TravelClassId = 1;
    
    Booking.getCapacitybyTravelClass(ScheduleId, TravelClassId, dbCon, (err, seatCapacity, fields) => {
        const seat_cap = {};

        seat_cap[0] = seatCapacity[0]["NumRows"];
        seat_cap[1] = seatCapacity[0]["NumCols"];

        Booking.getSeatsbyTravelClass(ScheduleId, TravelClassId, dbCon, (err, seatStates, fields) => {

            const booked_seats = [];

            seatStates.forEach((value, index, array) => {
                if(value["SeatStateID"] == 3) { // only booked seats
                    booked_seats.push(value.SeatNo);    
                }
                
            })


            res.render('seatSelection', {title: 'Seat Selection', layout: './layouts/seat_select_layout', seat_cap: seat_cap, booked_seats: booked_seats});
            
            
        });
        


    })
};

const select_seat_post = (req, res) => {
    const data = req.body;
    const dbCon = req.dbCon;
    const ScheduleId = 7;
    const stateID = 2;
    // for (let i=0; i < Object.keys(data).length; i++){
    //     console.log(ob[keys]);
    // } 

    const seat_array = Object.values(data);
    // console.log(seat_array);

    for (let i=0; i < seat_array.length; i++){
        // console.log(seat_array[i]);
        Booking.updateSeatState(stateID, seat_array[i], dbCon, function(err, result, fileld){
            if(err) throw err;
        })
    }; 

    req.session.seat_array = seat_array;
    
    
    // Booking.getAvailableCapacity(ScheduleId, dbCon, function(err, result, fileld){
    //     if(err) throw err;

    //     const available_seats_current = (result[0]["AvailableNoSeats"]);
    //     console.log(available_seats_current);
    //     const available_seats_new = available_seats_current - seat_array.length;
    //     console.log(available_seats_new);

    //     Booking.updateAvailableNoSeats(available_seats_new, ScheduleId, dbCon, function(err, result, fileld){
    //             if(err) throw err;
    //         });

    // });
    
    res.redirect("/beforePayment")
}

const before_payment_get = (req, res) => { 
    const dbCon = req.dbCon;
    const TravelClassID =1;
    const ScheduleId = 7;
    const RegisteredTravellerID = 1;

    const sess = req.session;
    const seat_array = sess.seat_array;
    console.log(seat_array, "this is session variable");

    Booking.getTravelClassPrice(TravelClassID, ScheduleId, dbCon, function(err, result, fileld){
        if(err) throw err;
        const travel_class_price = (result[0]["Price"]);
        console.log(travel_class_price);

        Booking.getDiscountPercentage(RegisteredTravellerID, dbCon, function(err, result, fileld){
            if(err) throw err;

            const discount_percentage = (result[0]["Discount"]);
            console.log(discount_percentage);

            const discounted_seat = travel_class_price - (travel_class_price*discount_percentage)/100;
            console.log(discounted_seat);

            const subtotal = seat_array.length *  travel_class_price;
            console.log(subtotal, "subtotal");
            sess.subtotal = subtotal;

            const tot_discount = subtotal * discount_percentage /100;
            console.log(tot_discount, "total discount");
            sess.tot_discount = tot_discount;

            const tot_to_pay = subtotal - tot_discount;
            console.log(tot_to_pay, "total to pay");

            res.render('beforePayment', {title: 'Payment', layout: './layouts/payment_layout', subtotal: subtotal, tot_discount: tot_discount, tot_to_pay: tot_to_pay});

        });
    });    
}


const before_payment_post = (req, res) => {
    const dbCon = req.dbCon;
    const BookingID = 37;
    const ScheduleId = 7;
    const stateID = 3;
    const sess = req.session;
    const subtotal = sess.subtotal;
    const tot_discount = sess.tot_discount;
    const seat_array = sess.seat_array;

    const bookingDate = new Date();
    const bookingTime = bookingDate.getHours() + ":" + bookingDate.getMinutes() + ":" + bookingDate.getSeconds();

    console.log(bookingDate);
    console.log(bookingTime);

    Booking.completeBooking(tot_discount, subtotal, BookingID, bookingDate, bookingTime,dbCon, function(err, result, fileld){
        if(err) throw err;

        Booking.getAvailableCapacity(ScheduleId, dbCon, function(err, result, fileld){
            if(err) throw err;

            const available_seats_current = (result[0]["AvailableNoSeats"]);
            console.log(available_seats_current);
            const available_seats_new = available_seats_current - seat_array.length;
            console.log(available_seats_new);

            Booking.updateAvailableNoSeats(available_seats_new, ScheduleId, dbCon, function(err, result, fileld){
                if(err) throw err;

                for (let i=0; i < seat_array.length; i++){
                    // console.log(seat_array[i]);
                    Booking.updateSeatState(stateID, seat_array[i], dbCon, function(err, result, fileld){
                        if(err) throw err;
                    })
                };     

            });

    });
        res.send('Booking Completed');
    });

    
    
}

const add_payment_get =(req, res ) => {
    res.render('payment', {title: 'Payment', layout: './layouts/payment_layout'});
}

// const add_payment_post = (req, res) => {
//     res.render(window.close());
// }




module.exports ={
    add_passenger_details_get,
    add_passenger_details_post,
    add_guest_details_get,
    add_guest_details_post,
    select_seat_get,
    add_payment_get,
    // add_payment_post,
    before_payment_get,
    before_payment_post,
    select_seat_post
}