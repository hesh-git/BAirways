//searchFlights for booking 

const FlightSearchModel = require("../models/FlightSearchModel");

const searchFlight_get = (req, res) => {
    const con = req.dbCon;

    //Get all the Airports cords with their names
    FlightSearchModel.getAirports(con, (err, result, fields) => {
        if (err) throw err;

        const airportCodes = [];
        const airportNames = [];

        result.forEach((value, index, array) => {
            airportCodes.push(value["AirportCode"]);
            airportNames.push(value["Name"]);
        })

        res.render('searchFlights', {title : 'Search Flight', airportCodes: airportCodes, airportNames : airportNames,layout: './layouts/flightsearch_layout'});
    })

    
}

const searchFlight_post = (req, res) => {
    const data = req.body; //data about inputted parameters on flight
    const con = req.dbCon; //get database connection from the request
    
    // const book = req.body.book;
    const Ffrom = data.Ffrom;
    const Fto = data.Fto;
    const departing = data.departing;
    const returning = data.returning;
    const adults = data.adults;
    const children = data.children;
    const requireSeats = adults + children;
    const travelClass = data.travelClass;
    
    FlightSearchModel.searchFlight(Ffrom, Fto, departing, returning, requireSeats, travelClass, con, function(error, results, fields){
        console.log(results);
        if (error) throw error;
        res.send('Searching for Flights');
    });
}





module.exports = {
    searchFlight_get,
    searchFlight_post
}

