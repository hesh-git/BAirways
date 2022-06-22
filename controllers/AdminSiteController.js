// models
const AircraftModel = require("../models/AircraftModel");
const Aircraft = require("../models/Aircraft");
const AirportLocationModel = require("../models/AirportLocation");
const FlightModel = require("../models/Flight");
const FlightSchedule = require("../models/FlightSchedule");
const FlightSearchModel = require("../models/FlightSearchModel");
const TravelClassPriceModel = require("../models/TravelClassPriceModel");

const get_flightDetails = (FlightNo, dbCon) => {
    let details = [];
    FlightModel.get_flightDetails(FlightNo, dbCon, (err, result, fields) => {
        if(err) throw err;
        // console.log(result);
        // return result;
        details.push(result[0])
        console.log(details);
        // details["Origin"] = result[0]["Origin"];
        // details["Destination"] = result[0]["Destination"];
    });
    console.log(details);
    return details;
}

const dashboard = (req, res) => {
    
    const dbCon = req.dbCon;

    const today = new Date(); // get today date

    FlightSchedule.get_schedules_for_day(today, dbCon, (err, schedules, fields) => {
        if(err) throw err;

        FlightSchedule.get_all_states(dbCon, (err, states, fields) => {
            if(err) throw err;

            const state_list = {}; // states as key=>value paires
            

            states.forEach((value, index, array) => {
                state_list[value["ID"]] = value["NAME"];
            });

            FlightModel.get_all_flightNo(dbCon, (err, flight_details, fields) => {
                if(err) throw err;

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
            })

            

            
            
            
        })
    })
    
}



const add_schedule_get = (req, res) => {

    const dbCon = req.dbCon;
    

    // get all flights : need to limit
    FlightModel.get_all_flightNo(dbCon, (err, result, fields) => {
        if(err) throw err;

        const flightNoList = []
        
        result.forEach((value, index, array) => {
            flightNoList.push(value["FlightNo"]);
        });

        Aircraft.get_all_AircraftID(dbCon, (err, result, fields) => {
            if(err) throw err;

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
    StateID = 1 // for newly adding flight schedules state is future (stateID = 1)
    DepartureDate = data.DepartureDate;
    DepartureTime = data.DepartureTime;
    ArrivalDate = data.ArrivalDate;
    ArrivalTime = data.ArrivalTime;

    FlightSchedule.add_flight_schedule(FlightNo, AircraftID, StateID, DepartureDate, DepartureTime, ArrivalDate, ArrivalTime, dbCon, (err, result, fields) => {
        if(err) throw err;
        console.log("In the add flight schedule")

        res.redirect("/admin/add_schedule");
    })
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

    FlightSchedule.update_flight_schedule(schedule_id, DepartureDate, DepartureTime, ArrivalDate, ArrivalTime, dbCon, (err, result, fields) => {
        if(err) throw err;

        res.redirect("/admin");
    });
}
// add a airport
const add_airport_get = (req, res) => {
    res.render('./admin/add_airport', {title: 'Add | Airport', layout: './layouts/admin_layout'});
}

const add_airport_post = (req, res) => {
    const data = req.body; // data about airport location
    const dbCon = req.dbCon; // get database connection from the request

    // location levels of airport
    const AirportCode = data.AirportCode;
    const Country = data.Country;
    const State = data.State;
    const City = data.City;

    // save the airport code to database
    AirportLocationModel.save_to_location(AirportCode, dbCon, (err, result, fields) => {
        if(err) throw err;

        const airport_location_id = result.insertId; // location id of airport
        // save airport code to airport
        AirportLocationModel.save_airport_code(AirportCode, airport_location_id, dbCon, (err, result, fields) => {
            if(err) throw err;

            // save city to database
            AirportLocationModel.save_to_location(City, dbCon, (err, result, fields) => {
                if(err) throw err;

                const city_id = result.insertId; // location id of city

                // add airport code and city as pair to database
                AirportLocationModel.save_location_pair(city_id,airport_location_id, dbCon, (err, result, fields) => {
                    if(err) throw err;

                    // if state exists in location levels
                    if(State) {
                        AirportLocationModel.save_to_location(State, dbCon, (err, result, fields) => {
                            if(err) throw err;

                            const state_id = result.insertId; // location id of State

                            // add city and state as a location pair to database
                            AirportLocationModel.save_location_pair(state_id, city_id, dbCon, (err, result, fields) => {
                                if(err) throw err;

                                // save Country
                                AirportLocationModel.save_to_location(Country, dbCon, (err, result, fields) => {
                                    if(err) throw err;

                                    const country_id = result.insertId; // location id of country

                                    // add country and state as a location pair to database
                                    AirportLocationModel.save_location_pair(country_id, state_id, dbCon, (err, result, fields) => {
                                        if(err) throw err;


                                    })
                                })
                            })

                        })
                    }
                    // when there is no state exists in location levels
                    else {
                        // save country
                        AirportLocationModel.save_to_location(Country, dbCon, (err, result, fields) => {
                            if(err) throw err;

                            const country_id = result.insertId; // location id of country

                            // add country and city as a location pair to database
                            AirportLocationModel.save_location_pair(country_id, city_id, dbCon, (err, result, fields) => {
                                if(err) throw err;
                            })
                        })
                    }
                })
            })
        })
        res.redirect('/admin/add_airport');
    })
}

// add a aircraft
const add_aircraft_get = (req, res) => {
    res.render('./admin/add_aircraft', {title: 'Admin | Aircraft', layout: './layouts/admin_layout'})
}

const add_aircraft_post = (req, res) => {
    const data = req.body; // data entered by user
    const dbCon = req.dbCon;

    AircraftModel.set_database(dbCon);

    console.log(data);
    const eco_numRows = parseInt(data.eco_numRows);
    const eco_numCols = parseInt(data.eco_numCols);
    const busi_numRows = parseInt(data.busi_numRows);
    const busi_numCols = parseInt(data.busi_numCols);
    const plat_numRows = parseInt(data.plat_numRows);
    const plat_numCols = parseInt(data.plat_numCols);
    const SeatingCapacity = eco_numRows * eco_numCols + busi_numRows * busi_numCols + plat_numCols * plat_numRows;
    data.SeatingCapacity = SeatingCapacity;
    // save aircraft model data to database
    AircraftModel.save(data, dbCon, (err, result, fields) => {
        if(err) throw err;

        const NoOfAircrafts = data.NoOfAircrafts; // number of aircrafts for user entered model
        const modelId = result.insertId;
        // save aircraft ids to database
        for(let i = 0; i < NoOfAircrafts; i++){
            console.log(data["id"+i])
            Aircraft.save({'ID': data["id"+i], 'ModelID': modelId}, dbCon, (err, result, fields) => {
                if(err) throw err

            });
        }

        // save seat capacity of economy class
        AircraftModel.save_seat_capacity(modelId, 1, 0, eco_numRows, eco_numCols, dbCon, (err, result, fields) => {
            if(err) throw err;
        });

        // save seat capactiy of 
        AircraftModel.save_seat_capacity(modelId, 2, eco_numRows, busi_numRows, busi_numCols, dbCon, (err, result, fields) => {
            if(err) throw err;
        });

        AircraftModel.save_seat_capacity(modelId, 3, busi_numRows + eco_numRows, plat_numRows, plat_numCols, dbCon, (err, result, fields) => {
            if(err) throw err;
        });

        res.redirect('/admin/add_aircraft');
    })
}

const add_flight_get = (req, res) => {
    const dbCon = req.dbCon;
    

    // get all airport codes : need to limit
    AirportLocationModel.get_all_airports(dbCon, (err, result, fields) => {
        if(err) throw err;

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

    FlightModel.save(FlightNo, Origin, Destination, dbCon, (err, result, fields) => {
        if(err) throw err;

        res.redirect("/admin/add_flight");
    })

}

const add_price_get = (req, res) => {
    const dbCon  = req.dbCon;

    FlightModel.get_all_flightNo(dbCon, (err, FlightDetails, fields) => {
        if(err) throw err;

        Aircraft.get_all_AircraftID(dbCon, (err, aircraftIDs, fields) => {

            FlightSearchModel.getAllClasses(dbCon, (err, classDetails, fields) => {

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

add_price_post = (req, res) => {
    const data = req.body;
    const dbCon = req.dbCon;

    const TravelClassID = data.TravelClassID;
    const FlightNo = data.FlightNo;
    const AircraftID = data.AircraftID;
    const Price = data.Price;

    TravelClassPriceModel.add_price(TravelClassID, FlightNo, AircraftID, Price, dbCon, (err, result, fields) => {
        if(err) throw err;

        res.redirect('/admin/add_price');
    })
}



module.exports = {
    dashboard,
    add_schedule_get,
    add_schedule_post,
    add_airport_get,
    add_airport_post,
    add_aircraft_get,
    add_aircraft_post,
    add_flight_get,
    add_flight_post,
    get_flightDetails,
    add_price_get,
    add_price_post,
    update_schedule_get,
    update_schedule_post
}