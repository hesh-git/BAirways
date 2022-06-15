const add_price = (TravelClassID, FlightNo, AircraftID, Price, dbCon, callback) => {
    const sql = "INSERT INTO `TravelClassPrice`(`TravelClassID`, `FlightNo`, `AircraftID`, `Price`) VALUES (?,?,?,?)";
    dbCon.query(sql, [TravelClassID, FlightNo, AircraftID, Price], callback);
}

module.exports = {
    add_price
}