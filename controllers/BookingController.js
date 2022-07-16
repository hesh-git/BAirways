const Booking = require("../models/Booking");

const add_pass_details_get = (req, res) => {
    const schedule_id = req.query.schedule_id;
    const dbCon = req.dbCon;
    
    // add schedule id to session
    const sess = req.session;
    sess.ScheduleId = schedule_id;

    const no_adults = sess.no_adults;
    const no_children = sess.no_children;

    if(no_adults == undefined) {
        res.redirect("/searchFlight");
    } else {

        if(req.user != null && req.user.userType == "traveller") {
            
            const reg_id = req.user.id;
            Booking.get_travellerID(reg_id, dbCon, (err, result, fields) => {
                if(err) {
                    return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                }

                const travellerID = result[0]["ID"];
                sess.TravellerID = travellerID;

                res.render('passengerDetails', {title: 'PassengerDetails', layout: './layouts/layout', no_adults: no_adults, no_children: no_children});
            })
        } else {
            res.render('guestDetails', {title: 'GuestDetails', layout: './layouts/layout',no_adults: no_adults, no_children: no_children});
        }
    }
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

    if(no_adults == undefined) {
        res.redirect("/searchFlight");
    } else {

        Booking.addBooking(FlightScheduleID, TravellerID, TravelClassID,BookingStateID, NumPassengers, dbCon, function(err, result, fileld){
            if(err) {
                return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
            }
            const BookingID = result.insertId;
            sess.BookingID = BookingID;


            for (let i=0; i < no_adults; i++){
                let Gender = data['GenderP'+i];
                let DateOfBirth = data['DateOfBirthP'+i];
                let FirstName = data['FirstNameP'+i];
                let LastName = data['LastNameP'+i];
                Booking.addPassenger(BookingID, 1, Gender, FirstName, LastName, DateOfBirth, dbCon, function (err, result, fields){
                    if(err) {
                        return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                    }
                })
            }

            for (let i=0; i < no_children; i++){
                let Gender = data['GenderC'+i];
                let DateOfBirth = data['DateOfBirthC'+i];
                let FirstName = data['FirstNameC'+i];
                let LastName = data['LastNameC'+i];
                Booking.addPassenger(BookingID, 2, Gender, FirstName, LastName, DateOfBirth, dbCon, function (err, result, fields){
                    if(err) {
                        return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                    }
                    
                })
            }

            res.redirect("/seat-selection");

        })

    
    }
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

    if(no_adults == undefined) {
        res.redirect("/searchFlight");
    } else {

        Booking.addTraveller(dbCon, function(err, result, fileld){
            if(err) {
                return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
            }
            
            const TravellerID = result.insertId;
            sess.TravellerID = TravellerID;

            Booking.addGuest(TravellerID, data['FirstName'], data['LastName'], data['Email'], data['ContactNumber'], dbCon, function(err, result, fields){
                if(err) {
                    return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                }    
            })

            Booking.addBooking(FlightScheduleID, TravellerID, TravelClassID,BookingStateID,NumPassengers, dbCon, function(err, result, fileld){
                if(err) {
                    return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                }
                const BookingID = result.insertId;
                sess.BookingID = BookingID;
        
                for (let i=0; i < no_adults; i++){
                    let Gender = data['GenderP'+i];
                    let DateOfBirth = data['DateOfBirthP'+i];
                    let FirstName = data['FirstNameP'+i];
                    let LastName = data['LastNameP'+i];
                    Booking.addPassenger(BookingID, 1, Gender, FirstName, LastName, DateOfBirth, dbCon, function (err, result, fields){
                        if(err) {
                            return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                        }
                    })
                }
        
                for (let i=0; i < no_children; i++){
                    let Gender = data['GenderC'+i];
                    let DateOfBirth = data['DateOfBirthC'+i];
                    let FirstName = data['FirstNameC'+i];
                    let LastName = data['LastNameC'+i];
                    Booking.addPassenger(BookingID, 2, Gender, FirstName, LastName, DateOfBirth, dbCon, function (err, result, fields){
                        if(err) {
                            return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                        }
                        
                    })
                }
        
                res.redirect("/seat-selection");
        
            })
        })
    }
}


const select_seat_get = (req, res) => {
    const dbCon = req.dbCon;
    const sess = req.session;

    const ScheduleId = sess.ScheduleId;
    // const ScheduleId = 13;
    const TravelClassId = sess.TravelClassID;
    // const TravelClassId = 3;

    if(ScheduleId == undefined) {
        res.redirect("/searchFlight");
    } else {

        Booking.getCapacity(ScheduleId, dbCon, (err, result, fields) => {
            if(err) {
                return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
            }

            const rows = [];
            rows.push(result[0]["NumRows"]);
            rows.push(result[1]["NumRows"]); 
            rows.push(result[2]["NumRows"]);

            Booking.getCapacitybyTravelClass(ScheduleId, TravelClassId, dbCon, (err, seatCapacity, fields) => {
                if(err) {
                    return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                }
                const seat_cap = {};
        
                seat_cap[0] = seatCapacity[0]["NumRows"];
                seat_cap[1] = seatCapacity[0]["NumCols"];
        
                Booking.getSeatsbyTravelClass(ScheduleId, TravelClassId, dbCon, (err, seatStates, fields) => {
                    if(err) {
                        return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                    }
        
                    const booked_seats = [];
        
                    seatStates.forEach((value, index, array) => {
                        if(value["SeatStateID"] == 3) { // only booked seats
                            booked_seats.push(value.SeatNo);    
                        }
                        
                    })

                

                    var intial_index = 0;
                    if (TravelClassId == 1){
                        intial_index = 0;
                    } else if (TravelClassId == 2){
                        intial_index = rows[0];
                    } else if (TravelClassId == 3){
                        intial_index = rows[0] + rows [1];
                    }
        
                    res.render('seatSelection', {title: 'Seat Selection', layout: './layouts/seat_select_layout', seat_cap: seat_cap, booked_seats: booked_seats, intial_index: intial_index});
                    
                    
                });
                
            });

        });
    }
};

const select_seat_post = (req, res) => {
    const data = req.body;
    const dbCon = req.dbCon;
    const sess = req.session;

    const ScheduleId = sess.ScheduleId;
    const stateID = 2;
    const TravelClassId = sess.TravelClassID;

    const seat_array = Object.values(data);
    const no_selected_seats = seat_array.length;
    const total_passengers = sess.no_adults + sess.no_children;

    if(ScheduleId == undefined) {
        res.redirect("/searchFlight");
    } else {

        if(no_selected_seats != total_passengers) {
            const alert = "Please select only " + total_passengers + " seats";
            req.flash("error", alert);
            res.redirect("/seat-selection");
            
        }

        else {
            for (let i=0; i < seat_array.length; i++){
                Booking.updateSeatState(stateID, ScheduleId, seat_array[i], dbCon, function(err, result, fileld){
                    if(err) {
                        return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                    }
                })
            }; 
        
            sess.seat_array = seat_array;
            
            res.redirect("/beforePayment")
        }
    }
}

const before_payment_get = (req, res) => { 
    const dbCon = req.dbCon;
    const sess = req.session;

    const TravelClassID =sess.TravelClassID;
    const TravellerID = sess.TravellerID;
    const ScheduleId = sess.ScheduleId;
    // const RegisteredTravellerID = 2;
    const seat_array = sess.seat_array;
    if(req.user != null && req.user.userType == "traveller" ){
        sess.reg = true;
    }
    const reg = sess.reg;


    if(TravelClassID == undefined) {
        res.redirect("/searchFlight");
    } else {

        Booking.getTravelClassPrice(TravelClassID, ScheduleId, dbCon, function(err, result, fileld){
            if(err) {
                return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
            }
            const travel_class_price = (result[0]["Price"]);
            if (reg){
                Booking.getDiscountPercentage(TravellerID, dbCon, function(err, result, fileld){
                    if(err) {
                        return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                    }
        
                    const discount_percentage = (result[0]["Discount"]);
        
                    const discounted_seat = travel_class_price - (travel_class_price*discount_percentage)/100;
        
                    const subtotal = seat_array.length *  travel_class_price;
                    sess.subtotal = subtotal;
        
                    const tot_discount = subtotal * discount_percentage /100;
                    sess.tot_discount = tot_discount;
        
                    const tot_to_pay = subtotal - tot_discount;
        
                    res.render('beforePayment', {title: 'Payment', layout: './layouts/payment_layout', subtotal: subtotal, tot_discount: tot_discount, tot_to_pay: tot_to_pay});
        
                });

            } else {
                const subtotal = seat_array.length *  travel_class_price;
                sess.subtotal = subtotal;

                const tot_discount = 0;
                sess.tot_discount = tot_discount;

                const tot_to_pay = subtotal;

                res.render('beforePayment', {title: 'Payment', layout: './layouts/payment_layout', subtotal: subtotal, tot_discount: tot_discount, tot_to_pay: tot_to_pay});



            }
        });    
    }
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
    if(req.user != null && req.user.userType == "traveller"){
        sess.reg = true;
    }
    const reg = sess.reg;
    const TravellerID = sess.TravellerID;
    const TravelClassID = sess.TravelClassID;

    const bookingDate = new Date();
    const bookingTime = bookingDate.getHours() + ":" + bookingDate.getMinutes() + ":" + bookingDate.getSeconds();

    if(ScheduleId == undefined) {
        res.redirect("/searchFlight");
    } else {

        Booking.completeBooking(tot_discount, subtotal, BookingID, bookingDate, bookingTime,dbCon, function(err, result, fileld){
            if(err) {
                return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
            }

            Booking.getAvailableCapacity(ScheduleId, dbCon, function(err, result, fileld){
                if(err) {
                    return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                }
                const available_seats_current = (result[0]["AvailableNoSeats"]);
                const passengers_current = (result[0]["NoPassengers"]);
                
                const passengers_new = passengers_current + seat_array.length;
                const available_seats_new = available_seats_current - seat_array.length;
                const passenger_count = seat_array.length;

                Booking.updateAvailableNoSeats(passenger_count, available_seats_new, passengers_new, ScheduleId, TravelClassID, dbCon, function(err, result, fileld){
                    if(err) {
                        return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                    }

                    
                    for (let i=0; i < seat_array.length; i++){
                        
                        Booking.updateSeatState(stateID, ScheduleId, seat_array[i], dbCon, function(err, result, fileld){
                            
                            if(err) {
                                return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                            }
                        })
                    }; 
                    
                    Booking.getPassengers(BookingID, dbCon, function(err, passengers, fileld){
                        if(err) {
                            return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                        } 
                        const passenger_list = [];

                        passengers.forEach((value, index, array) => {
                            passenger_list.push(value.ID);
                        });

                        for (let k=0; k < passenger_list.length; k++){
                            const seatNo = seat_array[k];
                            const ID = passenger_list[k];

                            Booking.addSeatNumber(seatNo, ID, dbCon, function(err, result, fileld){
                                if(err) {
                                    return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                                }
                            });
                        }

                        if (reg) {
                            Booking.getNoBookings(TravellerID, dbCon, function(err, result, fileld){
                                if(err) {
                                    return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                                }

                                const no_bookings_current = result[0]["NumBookings"];
                                const no_bookings_new = no_bookings_current + 1;

                                Booking.updateNoBooking(no_bookings_new, TravellerID, dbCon, function(err, result, fileld){
                                    if(err) {
                                        return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                                    }
                                    res.redirect("/success"); 

                                });
                            });
                        }else{
                            res.redirect("/success"); 
                        }    
                    });
                });
        });
            
            // req.session.destroy();
        });

    
    }
}

const add_payment_get =(req, res ) => {
    res.render('payment', {title: 'Payment', layout: './layouts/payment_layout'});
}

// const add_payment_post = (req, res) => {
//     res.render(window.close());
// }

const success_get = (req, res) => {
    const user = req.user;
    let registered = false;

    if(user != null && req.user.userType == "traveller") {
        registered = true;
    }
    req.session.destroy();
    res.render('success', {title: 'Success', registered: registered, layout: './layouts/payment_layout'})
}




module.exports ={
    add_passenger_details_post,
    add_guest_details_post,
    select_seat_get,
    add_payment_get,
    // add_payment_post,
    before_payment_get,
    before_payment_post,
    select_seat_post,
    success_get,
    add_pass_details_get
}