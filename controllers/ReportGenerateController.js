const FlightModel = require("../models/Flight");
const AirportLocationModel = require("../models/AirportLocation");

const passenger_details_get = (req, res) => {
    const dbCon = req.dbCon;

    FlightModel.get_all_flightNo(dbCon, (err, result, fields) => {
        if(err) throw err;

        const flightNoList = []
        
        result.forEach((value, index, array) => {
            flightNoList.push(value["FlightNo"]);
        });

        res.render('./admin/passenger_details', {title: 'Passenger Details', flightNoList: flightNoList, layout: './layouts/admin_layout'});
    });
}


const passenger_details_post = (req, res) => {
    const dbCon = req.dbCon;
    const data = req.body;

    const FlightNo = data.FlightNo;
    res.send(FlightNo);
}

const passenger_statistics_get = (req, res) => {
    const dbCon = req.dbCon;
    
    AirportLocationModel.get_all_airports(dbCon, (err, result, fields) => {
        if(err) throw err;

        const airportCodes = []
        
        result.forEach((value, index, array) => {
            airportCodes.push(value["AirportCode"])
        });

        res.render('./admin/passenger_statistics', {title: 'Passenger Statistics', airportCodes: airportCodes, layout: './layouts/admin_layout'});

    });
}

const passenger_statistics_post = (req, res) => {
    const dbCon = req.dbCon;

    const data = req.body;

    console.log(data);
    const FromDate = data.FromDate;
    const ToDate = data.ToDate;
    const Destination = data.Destination;

}

const booking_statistics_get = (req, res) => {
    const dbCon = req.dbCon;

    res.render('./admin/booking_statistics', {title: 'Booking Statistics', layout: './layouts/admin_layout'});

}

const booking_statistics_post = (req, res) => {
    const dbCon = req.dbCon;

    const data = req.body;

    const ToDate = data.ToDate;
    const Destination = data.Destination;
}

const flight_statistics_get = (req, res) => {
    const dbCon = req.dbCon;
    

    // get all airport codes : need to limit
    AirportLocationModel.get_all_airports(dbCon, (err, result, fields) => {
        if(err) throw err;

        const airportCodes = []
        
        result.forEach((value, index, array) => {
            airportCodes.push(value["AirportCode"])
        })

        res.render('./admin/flight_statistics', {title: 'Flight Statistics', airportCodes: airportCodes, layout: './layouts/admin_layout'});
    });
}

const flight_statistics_post = (req, res) => {
    const dbCon = req.dbCon;

    const data = req.body;

    const Origin = data.Origin;
    const Destination = data.Destination;

    console.log(Origin, Destination);
}

const revenue_details_get = (req, res) => {
    res.render('./admin/revenue_details', {title: 'Revenue Details', layout: './layouts/admin_layout'});
}

const revenue_details_post = (req, res) => {}

module.exports = {
    passenger_details_get,
    passenger_details_post,
    passenger_statistics_get,
    passenger_statistics_post,
    booking_statistics_get,
    booking_statistics_post,
    flight_statistics_get,
    flight_statistics_post,
    revenue_details_get,
    revenue_details_post
}