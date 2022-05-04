// models
const AircraftModel = require("../models/AircraftModel");
const Aircraft = require("../models/Aircraft");
const AirportLocationModel = require("../models/AirportLocation");

const dashboard = (req, res) => {
    res.render('./admin/admin_dashboard', {title: 'Admin | Dashboard'});
}

const add_schedule_get = (req, res) => {
    res.render('./admin/add_schedule', {title: 'Add | Flight Schedule'});
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

module.exports = {
    dashboard,
    add_schedule_get,
    add_airport_get,
    add_airport_post,
    add_aircraft_get,
    add_aircraft_post
}