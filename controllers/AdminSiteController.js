// models
const AircraftModel = require("../models/AircraftModel");
const Aircraft = require("../models/Aircraft");
const AirportLocationModel = require("../models/AirportLocation");
const FlightModel = require("../models/Flight");
const FlightSchedule = require("../models/FlightSchedule");
const FlightSearchModel = require("../models/FlightSearchModel");
const TravelClassPriceModel = require("../models/TravelClassPriceModel");
const DateTimeValidator = require("../validators/datetimeValidator");



const dashboard = (req, res) => {
    
    const dbCon = req.dbCon;

    const today = new Date(); // get today date

    FlightSchedule.get_schedules_for_day(today, dbCon, (err, schedules, fields) => {
        if(err) {
            return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
        } 


        FlightSchedule.get_all_states(dbCon, (err, states, fields) => {
            // if(err) throw err;
            if(err) {
                return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
            }

            const state_list = {}; // states as key=>value paires
            

            states.forEach((value, index, array) => {
                state_list[value["ID"]] = value["NAME"];
            });

            FlightModel.get_all_flightNo(dbCon, (err, flight_details, fields) => {
                // if(err) throw err;
                if(err) {
                    return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                }

                const flights_list = {}; // flights as key=>value paires

                flight_details.forEach((value, index, array) => {
                    flights_list[value["FlightNo"]] = {"Origin": value["Origin"], "Destination": value["Destination"]};
                });

                schedules.forEach((value, index, array) => {
                    value["State"] = state_list[value["StateID"]];
                    value['Origin'] = flights_list[value["FlightNo"]]["Origin"];
                    value['Destination'] = flights_list[value["FlightNo"]]["Destination"];

                    const DepartureDate = value["DepartureDate"];
                    const DepartureTime = value["DepartureTime"].split(":");
                    const ArrivalDate = value["ArrivalDate"];
                    const ArrivalTime = value["ArrivalTime"].split(":");

                    let days = (ArrivalDate.getTime()- DepartureDate.getTime()) / (1000 * 3600 * 24);
                    let hours = ArrivalTime[0] - DepartureTime[0];
                    let minutes = ArrivalTime[1] - DepartureTime[0];


                    if(hours < 0) {
                        days -= 1;
                        hours = 24 + hours;
                    }

                    if(minutes < 0) {
                        hours -= 1;
                        minutes = 60 + minutes;
                    }
                    
                    value["duration_days"] = days;
                    value["duration_hours"] = hours;
                    value["duration_minutes"] = minutes;
                });

                res.render('./admin/admin_dashboard', {title: 'Admin | Dashboard', schedules: schedules, layout: './layouts/admin_layout'});
            });
        })
        // }
    })
    
}



const add_schedule_get = (req, res) => {

    const dbCon = req.dbCon;
    

    // get all flights : need to limit
    FlightModel.get_flightNo_with_price(dbCon, (err, result, fields) => {
        // if(err) throw err;
        if(err) {
            return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
        }

        const flightNoList = []
        
        result.forEach((value, index, array) => {
            flightNoList.push(value["FlightNo"]);
        });

        Aircraft.get_AircraftIDs_with_price(dbCon, (err, result, fields) => {
            // if(err) throw err;
            if(err) {
                return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
            }

            const aircraftIDList = []

            result.forEach((value, index, array) => {
                aircraftIDList.push(value["ID"]);
            })

            res.render('./admin/add_schedule', {title: 'Add | Flight Schedule', flightNoList: flightNoList, aircraftIDList: aircraftIDList, layout: './layouts/admin_layout'});

        })
        
        
    })

}

const add_schedule_post = (req, res) => {
    const data = req.body; // data about adding flight schedule
    const dbCon = req.dbCon; // database connection

    // details of newly adding flight schedule
    FlightNo = data.FlightNo;
    AircraftID = data.AircraftID; 
    StateID = 1 // for newly adding flight schedules state is upcoming (stateID = 1)
    DepartureDate = data.DepartureDate;
    DepartureTime = data.DepartureTime;
    ArrivalDate = data.ArrivalDate;
    ArrivalTime = data.ArrivalTime;

    if(DateTimeValidator.validate_date_time(DepartureDate, DepartureTime, ArrivalDate, ArrivalTime)) {

        FlightSchedule.add_schedule(FlightNo, AircraftID, StateID, DepartureDate, DepartureTime, ArrivalDate, ArrivalTime, dbCon, (err, result) => {
            if(err) {
                return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
            }

            req.flash("success", "Flight Schedule Successfully added");
            res.redirect("/admin/add_schedule");
        })
    } else {
        req.flash("error", "Date and time are not valid");
        res.redirect("/admin/add_schedule");
    }
}

const update_schedule_get = (req, res) => {
    const schedule_id = req.query.schedule_id;

    // get all flights : need to limit
    res.render('./admin/update_schedule', {title: 'Add | Flight Schedule', schedule_id: schedule_id, layout: './layouts/admin_layout'});

}

const update_schedule_post = (req, res) => {
    const data = req.body; // data about adding flight schedule
    const dbCon = req.dbCon; // database connection

    // details of newly adding flight schedule
    DepartureDate = data.DepartureDate;
    DepartureTime = data.DepartureTime;
    ArrivalDate = data.ArrivalDate;
    ArrivalTime = data.ArrivalTime;
    schedule_id = data.schedule_id;

    if(DateTimeValidator.validate_date_time(DepartureDate, DepartureTime, ArrivalDate, ArrivalTime)) {
        FlightSchedule.update_flight_schedule(schedule_id, DepartureDate, DepartureTime, ArrivalDate, ArrivalTime, dbCon, (err, result, fields) => {
            // if(err) throw err;
            if(err) {
                return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
            }

            req.flash("success", "Flight Schedule Successfully updated!");
            res.redirect("/admin");
            // res.locals.success = {"msg": "Flight Schedule Successfully updated!"};
            // console.log("Flight Schedule Successfully added");
            // update_schedule_get(req, res);
            // dashboard(req, res);
        });
    } else {
        req.flash("error", "Date and time are not valid");
        res.redirect("/admin/update_schedule");
        // res.locals.alert = {"msg": "Date and time are not valid"};
        // console.log("date and time are not valid");
        // update_schedule_get(req, res);
    }
}
// add a airport
const add_airport_get = (req, res) => {
    res.render('./admin/add_airport', {title: 'Add | Airport', layout: './layouts/admin_layout'});
}

const add_airport_post = (req, res) => {
    const data = req.body; // data about airport location
    const dbCon = req.dbCon; // get database connection from the request

    // location levels of airport
    const AirportCode = data.AirportCode.toUpperCase();
    const Country = data.Country;
    const State = data.State;
    const City = data.City;

    AirportLocationModel.check_airport_code(AirportCode, dbCon, (err, result, fields) => {
        // if(err) throw err;
        if(err) {
            return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
        }

        if(result.length == 0) {

            AirportLocationModel.save_airport(AirportCode, City, State, Country, dbCon, (err, result) => {
                if(err) {
                    return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                }

                req.flash("success", "Airport successfully added");
                res.redirect('/admin/add_airport');
            })

        } else {
            req.flash("error", "AirportCode already existing in the system");
            // res.locals.alert = {"msg": "AirportCode already existing in the system"};
            res.redirect('/admin/add_airport');
            // add_airport_get(req, res);
        }
    });
}

// add a aircraft
const add_aircraft_get = (req, res) => {
    res.render('./admin/add_aircraft', {title: 'Admin | Aircraft', layout: './layouts/admin_layout'})
}

const add_aircraft_ex_get = (req, res) => {
    res.render('./admin/add_existing_aircraft', {title: 'Admin | Aircraft', layout: './layouts/admin_layout'})
}


const add_aircraft_post = (req, res) => {
    const data = req.body; // data entered by user
    const dbCon = req.dbCon;
    const sess = req.session;

    AircraftModel.set_database(dbCon);

    const eco_numRows = parseInt(data.eco_numRows);
    const eco_numCols = parseInt(data.eco_numCols);
    const busi_numRows = parseInt(data.busi_numRows);
    const busi_numCols = parseInt(data.busi_numCols);
    const plat_numRows = parseInt(data.plat_numRows);
    const plat_numCols = parseInt(data.plat_numCols);
    const SeatingCapacity = eco_numRows * eco_numCols + busi_numRows * busi_numCols + plat_numCols * plat_numRows;
    data.SeatingCapacity = SeatingCapacity;

    // check if user given model is an existing model
    AircraftModel.check_model(data.ModelName, dbCon, (err, result, fields) => {
        if(err) {
            return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
        }

        if(result.length == 0) {

            if(eco_numRows + busi_numRows + plat_numRows <= 26){
            // save aircraft model data to database
                AircraftModel.save(data, dbCon, (err, result, fields) => {
                    if(err) {
                        return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                    }

                    const NoOfAircrafts = data.NoOfAircrafts; // number of aircrafts for user entered model
                    const modelId = result.insertId;

                    // save seat capacity of economy class
                    AircraftModel.save_seat_capacity(modelId, 1,  eco_numRows, eco_numCols, dbCon, (err, result, fields) => {
                        if(err) {
                            return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                        }
                    });

                    // save seat capactiy of 
                    AircraftModel.save_seat_capacity(modelId, 2, busi_numRows, busi_numCols, dbCon, (err, result, fields) => {
                        if(err) {
                            return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                        }
                    });

                    AircraftModel.save_seat_capacity(modelId, 3, plat_numRows, plat_numCols, dbCon, (err, result, fields) => {
                        if(err) {
                            return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                        }
                    });

                    // save aircraft ids to database
                    for(let i = 0; i < NoOfAircrafts; i++){
                        // check if the aircraft id is existing in the system
                        Aircraft.check_aircraft(data["id"+i], dbCon, (err, result, fields) => {
                            if(err) {
                                return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                            }

                            if(result.length == 0) { // aircraft id is not in the system
                                Aircraft.save({'ID': data["id"+i], 'ModelID': modelId}, dbCon, (err, result, fields) => {
                                    if(err) {
                                        return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                                    }
            
                                });
                            } 
                            // else {
                            //     res.locals.alert = {"msg": data["id"+i] + " already existing in the system"};
                            //     add_aircraft_get(req, res);
                            // }
                        })
                        
                    }
                    req.flash("success", "Aircrafts added Successfully");
                    res.redirect("/admin/add_aircraft");
                    // res.locals.success = {"msg": "Aircrafts added Successfully"}
                    // add_aircraft_get(req, res);
                });
                
            } else {
                req.flash("error", "Number of rows in the aircraft should not be greater than 26");
                res.redirect("/admin/add_aircraft");
                // res.locals.alert = {"msg": "Number of rows in the aircraft should not be greater than 26"};
                // add_aircraft_get(req, res);
            }
        } else {
            sess.ModelId = result[0]["ID"];
            req.flash("error", "Given Aircraft model already added to the system. Add only aircrafts");
            res.redirect("/admin/add_aircraft_ex");
            // res.locals.alert = {"msg": "Given Aircraft model already added to the system. Add only aircrafts"};
            // add_aircraft_ex_get(req, res);
        }
    })
    
}

const add_aircraft_ex_post = (req, res) => {
    const data = req.body; // data entered by user
    const dbCon = req.dbCon;
    const sess = req.session;

    AircraftModel.set_database(dbCon);
    // save aircraft model data to database
    // console.log(req.dbCon);

    const NoOfAircrafts = data.NoOfAircrafts; // number of aircrafts for user entered model
    const modelId = sess.ModelId;

    if(modelId == undefined) {
        res.redirect('/admin/add_aircraft');
    } else {
        // save aircraft ids to database
        for(let i = 0; i < NoOfAircrafts; i++){
            // check if the aircraft id is existing in the system
            Aircraft.check_aircraft(data["id"+i], dbCon, (err, result, fields) => {
                if(err) {
                    return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                }

                if(result.length == 0) { // aircraft id is not in the system
                    Aircraft.save({'ID': data["id"+i], 'ModelID': modelId}, dbCon, (err, result, fields) => {
                        if(err) {
                            return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                        }

                    });
                } 
                // else {
                //     res.locals.alert = {"msg": data["id"+i] + " already existing in the system"};
                //     add_aircraft_ex_get(req, res);
                // }
            })
        }

        req.flash("success", "Aircrafts added Successfully");
        res.redirect('/admin/add_aircraft');
        // res.locals.success = {"msg": "Aircrafts added Successfully"}
        // add_aircraft_get(req, res);
    }
    
}

const add_flight_get = (req, res) => {
    const dbCon = req.dbCon;
    

    // get all airport codes : need to limit
    AirportLocationModel.get_all_airports(dbCon, (err, result, fields) => {
        if(err) {
            return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
        }

        const airportCodes = []
        
        result.forEach((value, index, array) => {
            airportCodes.push(value["AirportCode"])
        })

        res.render('./admin/add_flight', {title: 'Add | Flight', airportCodes: airportCodes, layout: './layouts/admin_layout'});
    });


    
}

const add_flight_post = (req, res) => {
    const data = req.body;
    const dbCon = req.dbCon;
    
    const FlightNo = data.FlightNo;
    const Origin = data.Origin;
    const Destination = data.Destination;

    if(Origin === Destination) {
        req.flash("error", "Origin and Destination must not be identical");
        res.redirect("/admin/add_flight");
        // res.locals.alert = {"msg": "Origin and Destination must not be identical"};
        // add_flight_get(req, res);
    } else {

        FlightModel.check_flightNo(FlightNo, dbCon, (err, result, fields) => {
            if(err) {
                return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
            }

            if(result.length == 0){
                FlightModel.save(FlightNo, Origin, Destination, dbCon, (err, result, fields) => {
                    if(err) {
                        return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                    }
            
                    req.flash("success", "Flight added successfully");
                    res.redirect("/admin/add_flight");
                    // res.locals.success = {"msg": "Flight added successfully"};
                    // add_flight_get(req, res);
                });
            } else {
                req.flash("error", "Flight number already existing in the system");
                res.redirect("/admin/add_flight");
                // res.locals.alert = {"msg": "Flight number already existing in the system"};
                // add_flight_get(req, res);
            }
        });

    }

}

const add_price_get = (req, res) => {
    const dbCon  = req.dbCon;

    FlightModel.get_all_flightNo(dbCon, (err, FlightDetails, fields) => {
        if(err) {
                return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
        }

        Aircraft.get_all_AircraftID(dbCon, (err, aircraftIDs, fields) => {
            if(err) {
                return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
            }

            FlightSearchModel.getAllClasses(dbCon, (err, classDetails, fields) => {
                if(err) {
                    return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                }

                const FlightNos = [];
                FlightDetails.forEach((value, index, array) => {
                    FlightNos.push(value["FlightNo"]);
                });

                const AircraftIDs = [];
                aircraftIDs.forEach((value, index, array) => {
                    AircraftIDs.push(value["ID"]);
                });

                const TravelClasses = [];
                classDetails.forEach((value, index, array) => {
                    const travelClass = {
                        'ID': value['ID'],
                        'Name': value["Name"]
                    }
                    TravelClasses.push(travelClass);
                });


                res.render('./admin/add_travel_clz_price', {title: 'Add | Price', FlightNums : FlightNos, AircraftIDs : AircraftIDs, TravelClasses: TravelClasses, layout: './layouts/admin_layout'});
            })
        })
    })
}

const add_price_post = (req, res) => {
    const data = req.body;
    const dbCon = req.dbCon;

    const TravelClassID = data.TravelClassID;
    const FlightNo = data.FlightNo;
    const AircraftID = data.AircraftID;
    const Eco_Price = data.eco_price;
    const Busi_Price = data.busi_price;
    const Plat_Price = data.plat_price;

    TravelClassPriceModel.check_if_exists(FlightNo, AircraftID, dbCon, (err, result, fields) => {
        if(err) {
            return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
        }

        if(result.length == 0) {
            TravelClassPriceModel.add_price(1, FlightNo, AircraftID, Eco_Price, dbCon, (err, result, fields) => {
                if(err) {
                    return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                }
        
                TravelClassPriceModel.add_price(2, FlightNo, AircraftID, Busi_Price, dbCon, (err, result, fields) => {
                    if(err) {
                        return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                    }
                    
                    TravelClassPriceModel.add_price(3, FlightNo, AircraftID, Plat_Price, dbCon, (err, result, fields) => {
                        if(err) {
                            return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                        }
                        
                        req.flash("success", "Price added Successfully!");
                        res.redirect('/admin/add_price');
                        // res.locals.success = {"msg": "Price added Successfully!"};
                        // add_price_get(req, res);
                    })
        
                })
                
            })
        } else {
            req.flash("error", "Price already exists in the system");
            res.redirect("/admin/add_price");
            // res.locals.alert = {"msg": "Price already exists in the system"};
            // add_price_get(req, res);
        }
    })

    
}



module.exports = {
    dashboard,
    add_schedule_get,
    add_schedule_post,
    add_airport_get,
    add_airport_post,
    add_aircraft_get,
    add_aircraft_ex_get,
    add_aircraft_post,
    add_aircraft_ex_post,
    add_flight_get,
    add_flight_post,
    add_price_get,
    add_price_post,
    update_schedule_get,
    update_schedule_post
}