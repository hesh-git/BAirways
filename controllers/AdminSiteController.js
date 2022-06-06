// models
const AircraftModel = require("../models/AircraftModel");
const Aircraft = require("../models/Aircraft");
const AirportLocationModel = require("../models/AirportLocation");
const FlightModel = require("../models/Flight");
const FlightSchedule = require("../models/FlightSchedule");

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
            const flights_list = {}; // flights as key=>value paires

            states.forEach((value, index, array) => {
                state_list[value["ID"]] = value["NAME"];
            });

            

            schedules.forEach((value, index, array) => {
                value["State"] = state_list[value["StateID"]];
                // const flightDetails = get_flightDetails(value["FlightNo"], dbCon);
                // console.log(flightDetails);
                // console.log(flightDetails);
                var results = {};
                FlightModel.get_flightDetails(value["FlightNo"], dbCon, (err, result) => {
                    // results = result;
                    // console.log(results);
                    if(err) throw err;
                    console.log(result);
                     
                });
                // console.log(results);
                // value["Origin"] = flightDetails["Origin"];
                // value["Destination"] = flightDetails["Destination"];
                // value["Duration"] = value["ArrivalDate"] + value["ArrivalTime"] - (value["DepartureDate"] + value["DepartureTime"]);
            });

            // console.log(schedules);
            res.render('./admin/admin_dashboard', {title: 'Admin | Dashboard', schedules: schedules, layout: './layouts/admin_layout'});
            
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

        res.redirect("/admin/add_schedule");
    })
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
    // save aircraft model data to database
    AircraftModel.save(data, dbCon, (err, result, fields) => {
        if(err) throw err;

        const NoOfAircrafts = data.NoOfAircrafts; // number of aircrafts for user entered model

        // save aircraft ids to database
        for(let i = 0; i < NoOfAircrafts; i++){
            console.log(data["id"+i])
            Aircraft.save({'ID': data["id"+i], 'ModelID': result.insertId}, dbCon, (err, result, fields) => {
                if(err) throw err

            });
        }
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
    get_flightDetails
}