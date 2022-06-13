//searchFlights for booking 

const FlightSearchModel = require("../models/FlightSearchModel");

const searchFlight_get = (req, res) => {
    const con = req.dbCon;

    //Get all airport codes with their names
    FlightSearchModel.getAirports(con, (err, result, fields) => {
        if (err) throw err;

        const airportCodes = [];
        const airportNames = [];
        console.log(result);
        result.forEach((value, index, array) => {
            airportCodes.push(value["AirportCode"]);
            airportNames.push(value["Name"]);
        })

        FlightSearchModel.getAllClasses(con, (err, result, fields) => {
            if (err) throw err;
            const travelClasses =  [];
            result.forEach((value,index,array) => {
                const travelClass = {
                    'ID' : value['ID'],
                    'Name' : value['Name']
                }
                travelClasses.push(travelClass);
            })
            res.render('searchFlights', {title : 'Search For a Flight', airportCodes : airportCodes, airportNames : airportNames, travelClasses : travelClasses, layout: './layouts/flightsearch_layout'});
        })

        
    })


    
}

const searchFlight_post = (req, res) => {
    const data = req.body; //data about inputted parameters on flight
    const con = req.dbCon; //get database connection from the request
    
    // const book = req.body.book;

    console.log(data);
    
    FlightSearchModel.getFlightByOrigin(data , con, function(error, results, fields){
        console.log(results);
        if (error) throw error;

        
    });
}





module.exports = {
    searchFlight_get,
    searchFlight_post,

}

