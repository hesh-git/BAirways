const get_passenger_details = (scheduleID, dbCon, callback) => {
    
        // get passenger details from passenger details view
        const sql_get_passenger_details = "SELECT * FROM `passenger_details` WHERE `FlightScheduleID` = ? AND `BookingStateID` = ?";
        dbCon.query(sql_get_passenger_details, [scheduleID, 2], callback);
    
}

const get_next_immediate_flight = (FlightNo, dbCon, callback) => {
    const sql_get_flightScheduleID = "SELECT `ID` FROM `FlightSchedule` WHERE `FlightNo` = ? AND `StateID` = ? ORDER BY `DepartureDate`, `DepartureTime` LIMIT 1";
    dbCon.query(sql_get_flightScheduleID, [FlightNo, 1], callback);
}

const get_passenger_statistics = (FromDate, ToDate, Destination, dbCon, callback) => {
    const sql_passenger_statistics = "SELECT sum(`NumPassengers`) `total_passengers` FROM `passenger_statistics` WHERE `Destination` = ? AND `ArrivalDate` BETWEEN ? AND ?";
    dbCon.query(sql_passenger_statistics, [Destination, FromDate, ToDate], callback);
}

const get_booking_statistics = (FromDate,ToDate, dbCon, callback) => {
    const sql_booking_statistics = "SELECT `TypeID`, sum(`numBookings`) `total_bookings` FROM `booking_statistics` WHERE `BookingDate` BETWEEN ? AND ? GROUP BY `TypeID`";
    dbCon.query(sql_booking_statistics, [FromDate,ToDate], callback);
}

const get_flight_statistics = (Origin, Destination, dbCon, callback) => {
    const today = new Date();
    const sql_change_to_ontime_today = "UPDATE `FlightSchedule` SET `StateID` = ? WHERE `DepartureDate` = ? AND `DepartureTime` <= ? AND `StateID` = ?";
    const month = today.getUTCMonth() + 1;
    const dateformated = today.getUTCFullYear() + "-" + month +"-" + today.getUTCDate();
    const time = today.getHours() + ":" + today.getMinutes();
    dbCon.query(sql_change_to_ontime_today, [2, dateformated, time, 1], (err, result, fields) => {
        const sql_change_to_ontime_past = "UPDATE `FlightSchedule` SET `StateID` = ? WHERE `DepartureDate` < ? AND `StateID` = ?";
        dbCon.query(sql_change_to_ontime_past, [2, dateformated, 1], (err, result, fields) => {
            const sql_flight_statistics = "SELECT `FlightScheduleID`, `FlightState`, `TotalNumPassengers` FROM `flight_statistics` WHERE `Origin` = ? AND `Destination` = ? AND ((`ArrivalDate` = ? AND `ArrivalTime` < ?) OR (`ArrivalDate` < ?))";
            dbCon.query(sql_flight_statistics, [Origin, Destination, dateformated, time, dateformated], callback);
        });
    });
}

const get_revenue_details = (dbCon, callback) => {
    const sql_revenue_details = "SELECT * FROM `revenue_details`";
    dbCon.query(sql_revenue_details, callback);
}
module.exports = {
    get_passenger_details,
    get_next_immediate_flight,
    get_passenger_statistics,
    get_booking_statistics,
    get_flight_statistics,
    get_revenue_details
}