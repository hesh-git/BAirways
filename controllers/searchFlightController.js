//searchFlights for booking 

const FlightSearchModel = require("../models/FlightSearchModel");

const searchFlight_get = (req, res) => {
    res.render('searchFlights', {title : 'Search Flight'});
}

const searchFlight_post = (req, res) => {
    const data = req.body; //data about inputted parameters on flight
    const con = req.dbCon; //get database connection from the request
    
    // const book = req.body.book;
    const Ffrom = req.body.Ffrom;
    const Fto = req.body.Fto;
    const departing = req.body.departing;
    const returning = req.body.returning;
    const adults = req.body.adults;
    const children = req.body.children;
    const travelClass = req.body.travelClass;
    
    FlightSearchModel.getFlightByOrigin(Ffrom , con, function(error, results, fields){
        console.log(results);
        if (error) throw error;

        
    });
}





module.exports = {
    searchFlight_get,
    searchFlight_post
}

