const add_flight_schedule = (FlightNo, AircraftID, StateID, StartTime, EndTime, dbCon, callback) => {

    const sql = "INSERT INTO `FlightSchedule`(`FlightNo`, `AircraftID`, `StateID`, `StartTime`, `EndTime`) VALUES (?,?,?,?,?)";

    dbCon.query(sql, [FlightNo, AircraftID, StateID, StartTime, EndTime], callback);
}

module.exports = {
    add_flight_schedule
}