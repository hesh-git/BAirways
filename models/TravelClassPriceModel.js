const add_price = (TravelClassID, FlightNo, AircraftID, Price, dbCon, callback) => {
    const sql = "INSERT INTO `TravelClassPrice`(`TravelClassID`, `FlightNo`, `AircraftID`, `Price`) VALUES (?,?,?,?)";
    dbCon.query(sql, [TravelClassID, FlightNo, AircraftID, Price], callback);
}

const check_if_exists = (FlightNo, AircraftID, dbCon, callback) => {
    const sql = "SELECT * FROM `TravelClassPrice` WHERE `FlightNo` = ? AND `AircraftID` = ?";
    dbCon.query(sql, [FlightNo, AircraftID], callback);
}

module.exports = {
    add_price,
    check_if_exists
}