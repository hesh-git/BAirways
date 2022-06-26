const Booking = require("../models/Booking");

const add_passenger_details_get = (req, res) => {
    const sess = req.session;

    const reg = true;
    sess.reg = reg;

    const no_adults = 1;
    sess.no_adults = no_adults;

    const no_children = 1;
    sess.no_children = no_children;

    const ScheduleId = 9;
    sess.ScheduleId = ScheduleId;

    const TravellerID = 4;
    sess.TravellerID = TravellerID;

    const TravelClassID = 1;
    sess.TravelClassID = TravelClassID;

    res.render('passengerDetails', {title: 'PassengerDetails', layout: './layouts/layout', no_adults: no_adults, no_children: no_children});
}

const add_passenger_details_post = (req, res) => {
    const data = req.body;
    const dbCon = req.dbCon;
    const sess = req.session;

    const no_adults = sess.no_adults;
    const no_children = sess.no_children;
    const NumPassengers = no_adults + no_children;

    const FlightScheduleID = sess.ScheduleId;
    const TravellerID = sess.TravellerID;
    const TravelClassID = sess.TravelClassID;
    
    const BookingStateID = 1;

    Booking.addBooking(FlightScheduleID, TravellerID, TravelClassID,BookingStateID, NumPassengers, dbCon, function(err, result, fileld){
        if(err)
            throw err
        const BookingID = result.insertId;
        sess.BookingID = BookingID;


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
    const sess = req.session;

    const reg = false;
    sess.reg = reg;

    const no_adults = 1;
    sess.no_adults = no_adults;

    const no_children = 0;
    sess.no_children = no_children;

    const ScheduleId = 9;
    sess.ScheduleId = ScheduleId;

    const TravelClassID = 2;
    sess.TravelClassID = TravelClassID;

    res.render('guestDetails', {title: 'GuestDetails', layout: './layouts/layout',no_adults: no_adults, no_children: no_children});
}

const add_guest_details_post =(req, res) => {
    const data = req.body;
    const dbCon = req.dbCon;
    const sess = req.session;

    const no_adults = sess.no_adults;
    const no_children = sess.no_children;
    const NumPassengers = no_adults + no_children;
    const FlightScheduleID = sess.ScheduleId;
    const TravelClassID = sess.TravelClassID;
    const BookingStateID = 1;
    
    

    Booking.addTraveller(dbCon, function(err, result, fileld){
        if(err)
            throw err
        
        const TravellerID = result.insertId;
        sess.TravellerID = TravellerID;

        Booking.addGuest(TravellerID, data['FirstName'], data['LastName'], data['Email'], data['ContactNumber'], dbCon, function(err, result, fields){
            if (err)
                throw err    
        })

        Booking.addBooking(FlightScheduleID, TravellerID, TravelClassID,BookingStateID,NumPassengers, dbCon, function(err, result, fileld){
            if(err)
                throw err
            const BookingID = result.insertId;
            sess.BookingID = BookingID;
    
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
    const sess = req.session;

    const ScheduleId = sess.ScheduleId;
    const TravelClassId = sess.TravelClassID;
    
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
    const sess = req.session;

    const ScheduleId = sess.ScheduleId;
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

    sess.seat_array = seat_array;
    
    
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
    const sess = req.session;

    const TravelClassID =sess.TravelClassID;
    const TravellerID = sess.TravellerID;
    const ScheduleId = sess.ScheduleId;
    // const RegisteredTravellerID = 2;
    const seat_array = sess.seat_array;
    const reg = sess.reg;

    console.log(seat_array, "this is session variable");

    Booking.getTravelClassPrice(TravelClassID, ScheduleId, dbCon, function(err, result, fileld){
        if(err) throw err;
        const travel_class_price = (result[0]["Price"]);
        console.log(travel_class_price);

        if (reg){
            Booking.getDiscountPercentage(TravellerID, dbCon, function(err, result, fileld){
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

        } else {
            const subtotal = seat_array.length *  travel_class_price;
            console.log(subtotal, "subtotal");
            sess.subtotal = subtotal;

            const tot_discount = 0;
            sess.tot_discount = tot_discount;

            const tot_to_pay = subtotal;

            res.render('beforePayment', {title: 'Payment', layout: './layouts/payment_layout', subtotal: subtotal, tot_discount: tot_discount, tot_to_pay: tot_to_pay});



        }

        // Booking.getDiscountPercentage(RegisteredTravellerID, dbCon, function(err, result, fileld){
        //     if(err) throw err;

        //     const discount_percentage = (result[0]["Discount"]);
        //     console.log(discount_percentage);

        //     const discounted_seat = travel_class_price - (travel_class_price*discount_percentage)/100;
        //     console.log(discounted_seat);

        //     const subtotal = seat_array.length *  travel_class_price;
        //     console.log(subtotal, "subtotal");
        //     sess.subtotal = subtotal;

        //     const tot_discount = subtotal * discount_percentage /100;
        //     console.log(tot_discount, "total discount");
        //     sess.tot_discount = tot_discount;

        //     const tot_to_pay = subtotal - tot_discount;
        //     console.log(tot_to_pay, "total to pay");

        //     res.render('beforePayment', {title: 'Payment', layout: './layouts/payment_layout', subtotal: subtotal, tot_discount: tot_discount, tot_to_pay: tot_to_pay});

        // });
    });    
}


const before_payment_post = (req, res) => {
    const dbCon = req.dbCon;
    const sess = req.session;

    const ScheduleId = sess.ScheduleId;
    const stateID = 3;
    const BookingID = sess.BookingID;
    const subtotal = sess.subtotal;
    const tot_discount = sess.tot_discount;
    const seat_array = sess.seat_array;
    const reg = sess.reg;
    const TravellerID = sess.TravellerID;

    const bookingDate = new Date();
    const bookingTime = bookingDate.getHours() + ":" + bookingDate.getMinutes() + ":" + bookingDate.getSeconds();

    console.log(bookingDate);
    console.log(bookingTime);

    Booking.completeBooking(tot_discount, subtotal, BookingID, bookingDate, bookingTime,dbCon, function(err, result, fileld){
        if(err) throw err;

        Booking.getAvailableCapacity(ScheduleId, dbCon, function(err, result, fileld){
            if(err) throw err;
            console.log(result[0]["NoPassengers"], "NoPassengers");
            const available_seats_current = (result[0]["AvailableNoSeats"]);
            const passengers_current = (result[0]["NoPassengers"]);
            
            const passengers_new = passengers_current + seat_array.length;
            console.log(available_seats_current);
            const available_seats_new = available_seats_current - seat_array.length;
            console.log(available_seats_new);

            Booking.updateAvailableNoSeats(available_seats_new, passengers_new, ScheduleId, dbCon, function(err, result, fileld){
                if(err) throw err;

                for (let i=0; i < seat_array.length; i++){
                    // console.log(seat_array[i]);
                    Booking.updateSeatState(stateID, seat_array[i], dbCon, function(err, result, fileld){
                        if(err) throw err;
                    })
                }; 
                
                Booking.getPassengers(BookingID, dbCon, function(err, passengers, fileld){
                    if(err) throw err; 
                    const passenger_list = [];

                    console.log(result);
                    passengers.forEach((value, index, array) => {
                        passenger_list.push(value.ID);
                    });
                    console.log(passenger_list);

                    for (let k=0; k < passenger_list.length; k++){
                        const seatNo = seat_array[k];
                        const ID = passenger_list[k];

                        Booking.addSeatNumber(seatNo, ID, dbCon, function(err, result, fileld){
                            if (err) throw err;
                        });
                    }

                    if (reg) {
                        Booking.getNoBookings(TravellerID, dbCon, function(err, result, fileld){
                            if(err) throw err;

                            const no_bookings_current = result[0]["NumBookings"];
                            const no_bookings_new = no_bookings_current + 1;

                            Booking.updateNoBooking(no_bookings_new, TravellerID, dbCon, function(err, result, fileld){
                                if(err) throw err;
                                res.send('Booking Completed - Registered traveller'); 

                            });
                        });
                    }else{
                        res.send('Booking Completed - Guset'); 
                    }    
                });
            });
    });
        
        // req.session.destroy();
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