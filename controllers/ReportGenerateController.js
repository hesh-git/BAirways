const FlightModel = require("../models/Flight");
const AirportLocationModel = require("../models/AirportLocation");
const ReportModel = require("../models/ReportModel");

const passenger_details_get = (req, res) => {
    const dbCon = req.dbCon;


    FlightModel.get_all_flightNo(dbCon, (err, result, fields) => {
        if(err) {
            return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
        }

        const flightNoList = [];
        
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
    FlightModel.get_all_flightNo(dbCon, (err, result, fields) => {
        if(err) {
            return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
        }

        const flightNoList = [];
        
        result.forEach((value, index, array) => {
            flightNoList.push(value["FlightNo"]);
        });
    ReportModel.get_next_immediate_flight(FlightNo, dbCon, (err, flightID, fields) => {
        if(err) {
            return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
        }
        console.log(flightID, "flightID");
        if(flightID === undefined || flightID.length == 0) {
            res.render('./admin/passenger_details', {title: 'Passenger Details', flightNoList: flightNoList, FlightNo: FlightNo, layout: './layouts/admin_layout'});
            // res.render('./admin/passenger_details', {title: 'Passenger Details', flightNoList: flightNoList, FlightNo: FlightNo, layout: './layouts/admin_layout'});
        } else {
            const scheduleID = flightID[0].ID;
            console.log("Schedule id: ", scheduleID);

            ReportModel.get_passenger_details(scheduleID, dbCon, (err, passenger_details, fields) => {
                if(err) {
                    return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                }
                console.log("passenger details", passenger_details);
                const adults = [];
                const children = [];
                passenger_details.forEach((value, index, array) => {
                    if(value["TypeID"] == 1) {
                        adults.push(value);
                    } else if(value["TypeID"] == 2) {
                        children.push(value);
                    }
                });
                console.log("adults: ", adults);
                console.log("children: ", children);

                // req.flash("adults", adults);
                // req.flash("children", children);
                // req.flash("FlightNo", FlightNo);
                // res.redirect("/admin/passenger_details");
                res.render('./admin/passenger_details', {title: 'Passenger Details', adults: adults, children: children, flightNoList: flightNoList, FlightNo: FlightNo, layout: './layouts/admin_layout'});
            });
        }
    })
})
}

const passenger_statistics_get = (req, res) => {
    const dbCon = req.dbCon;

    res.locals.num_passengers = req.flash("num_passengers");
    res.locals.FromDate       = req.flash("FromDate");
    res.locals.ToDate         = req.flash("ToDate");
    res.locals.Destination    = req.flash("Destination");
    
    AirportLocationModel.get_all_airports(dbCon, (err, result, fields) => {
        if(err) {
            return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
        }

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

    const FromDate = data.FromDate;
    const ToDate = data.ToDate;
    const Destination = data.Destination;

    ReportModel.get_passenger_statistics(FromDate, ToDate, Destination, dbCon, (err, result, fields) => {
        if(err) {
            return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
        }

        const num_passengers = result[0]["total_passengers"];

        req.flash("num_passengers", num_passengers);
        req.flash("FromDate", FromDate);
        req.flash("ToDate", ToDate);
        req.flash("Destination", Destination);
        res.redirect("/admin/passenger_statistics");
        // res.render('./admin/passenger_statistics', {title: 'Passenger Statistics', num_passengers: num_passengers, FromDate: FromDate, ToDate: ToDate, Destination: Destination,  airportCodes: airportCodes, layout: './layouts/admin_layout'});
    });

}

const booking_statistics_get = (req, res) => {
    const dbCon = req.dbCon;

    res.render('./admin/booking_statistics', {title: 'Booking Statistics', layout: './layouts/admin_layout'});

}

const booking_statistics_post = (req, res) => {
    const dbCon = req.dbCon;

    const data = req.body;

    const ToDate = data.ToDate;
    const FromDate = data.FromDate;

    ReportModel.get_booking_statistics(FromDate, ToDate, dbCon, (err, result, fields) => {
        if(err) {
            return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
        }
        const booking_statistics = {};

        result.forEach((value, index, array) => {
            booking_statistics[value["TypeID"]] = value["total_bookings"];
        });

        // console.log(booking_statistics);
        res.render('./admin/booking_statistics', {title: 'Booking Statistics', booking_statistics: booking_statistics, FromDate: FromDate, ToDate: ToDate, layout: './layouts/admin_layout'});
    });
}

const flight_statistics_get = (req, res) => {
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

        res.render('./admin/flight_statistics', {title: 'Flight Statistics', airportCodes: airportCodes, layout: './layouts/admin_layout'});
    });
}

const flight_statistics_post = (req, res) => {
    const dbCon = req.dbCon;

    const data = req.body;

    const Origin = data.Origin;
    const Destination = data.Destination;

    AirportLocationModel.get_all_airports(dbCon, (err, result, fields) => {
        if(err) {
            return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
        }

        const airportCodes = []
        
        result.forEach((value, index, array) => {
            airportCodes.push(value["AirportCode"])
        });
        ReportModel.get_flight_statistics(Origin, Destination, dbCon, (err, result, fields) => { 
            if(err) {
                return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
            }

            const flight_statistics = [];

            result.forEach((value, index, array) => {
                flight_statistics.push({
                    "FlightScheduleID": value["FlightScheduleID"],
                    "FlightState": value["FlightState"],
                    "TotalNumPassengers": value["TotalNumPassengers"]
                });
            });

            res.render('./admin/flight_statistics', {title: 'Flight Statistics', Origin: Origin, Destination: Destination, flight_statistics: flight_statistics, airportCodes: airportCodes, layout: './layouts/admin_layout'});
        });
    });
}

const revenue_details_get = (req, res) => {
    const dbCon = req.dbCon;

    ReportModel.get_revenue_details(dbCon, (err, result, fields) => {
        if(err) {
            return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
        }
        const revenue_details = [];

        result.forEach((value, index, array) => {
            revenue_details.push({
                "ModelName": value["ModelName"],
                "TotalRevenue": value["TotalRevenue"]
            });
        });

        res.render('./admin/revenue_details', {title: 'Revenue Details', revenue_details: revenue_details, layout: './layouts/admin_layout'});
    });
}

module.exports = {
    passenger_details_get,
    passenger_details_post,
    passenger_statistics_get,
    passenger_statistics_post,
    booking_statistics_get,
    booking_statistics_post,
    flight_statistics_get,
    flight_statistics_post,
    revenue_details_get
}