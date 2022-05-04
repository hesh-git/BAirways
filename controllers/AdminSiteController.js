const AircraftModel = require("../models/AircraftModel");
const Aircraft = require("../models/Aircraft");


const dashboard = (req, res) => {
    res.render('./admin/admin_dashboard', {title: 'Admin | Dashboard'});
}

const add_schedule_get = (req, res) => {
    res.render('./admin/add_schedule', {title: 'Add | Flight Schedule'});
}

const add_airport_get = (req, res) => {
    res.render('./admin/add_airport', {title: 'Add | Airport'});
}

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
    add_aircraft_get,
    add_aircraft_post
}