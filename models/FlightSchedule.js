const add_flight_schedule = (FlightNo, AircraftID, StateID, DepartureDate, DepartureTime, ArrivalDate, ArrivalTime, dbCon, callback) => {

    const sql = "INSERT INTO `FlightSchedule`(`FlightNo`, `AircraftID`, `StateID`, `DepartureDate`, `DepartureTime`, `ArrivalDate`, `ArrivalTime`) VALUES (?,?,?,?,?,?,?)";

    dbCon.query(sql, [FlightNo, AircraftID, StateID, DepartureDate, DepartureTime, ArrivalDate, ArrivalTime], callback);
}

module.exports = {
    add_flight_schedule
}