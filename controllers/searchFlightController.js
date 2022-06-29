//searchFlights for booking 
const { check, validationResult } = require("express-validator");

const FlightSearchModel = require("../models/FlightSearchModel");

const searchFlight_get = (req, res) => {
    //console.log(req.user);
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
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        const alert = errors.array()[0]
        console.log(alert)
        res.render('searchFlight', {
             title: 'searchFlight', layout: './layouts/flightsearch_layout',alert
        })  
    }

    // add flight search details to session
    const  sess = req.session;
    if(req.user == null) {
        sess.reg = false;
    } else {
        sess.reg = true;
    }

    sess.origin = data.Ffrom;
    sess.destination = data.Fto;
    sess.departureDate = data.departing;
    sess.no_adults = parseInt(data.adults);
    sess.no_children = parseInt(data.children);
    sess.TravelClassID = data.travelClass;

    FlightSearchModel.getFlightByOrigin(data , con, function(error, result, fields){

        if (error) throw error;
        const availableFlightDetails = [];

        result.forEach((value,index,array) => {
            console.log(value)
            const availableFlightDetail = {
                'FlightScheduleID': value['FlightScheduleID'],
                'FFromCode' : value['Origin'],
                'FToCode' : value['Destination'],
                'DepartureTime' : value['DepartureTime'],
                'ArrivalTime' : value['ArrivalTime'],
                'DepartureDate' : value['DepartureDate'],
                'ArrivalDate' : value['ArrivalDate'],
                'AirCraftID' : value['AircraftID'],
                'AirCraftModel' : value['ModelName'],
                'Price' : value['Price'],
                'TravellClass' : value['Name']


            }
            availableFlightDetails.push(availableFlightDetail);
        })

                
        FlightSearchModel.getAirports(con, (err, result, fields) => {
            if (err) throw err;
    
            const airportCodesandNames = {

            };
           
            result.forEach((value, index, array) => {
                airportCodesandNames[value['AirportCode']] = value['Name'];
            
            })
            res.render("flightSheduleTimeTable", {title: "Available Flights", availableFlightDetails : availableFlightDetails, airportCodesandNames : airportCodesandNames, layout : './layouts/schedule_layout'});
        });
        

        // res.render("flightSheduleTimeTable", {title: "Available Flights", availableFlightDetails : availableFlightDetails, airportCodesandNames : airportCodesandNames, layout : './layouts/schedule_layout'});

    });
}





module.exports = {
    searchFlight_get,
    searchFlight_post,
    

}

