const getFlightByOrigin = function(data, con, callback) {
    const Ffrom = data.Ffrom;
    const Fto = data.Fto;
    const departing = data.departing;
    const returning = data.returning;
    const adults = data.adults;
    const children = data.children;
    const travelClass = data.travelClass;
    console.log(Ffrom,Fto,departing,travelClass,parseInt(adults)+parseInt(children));
    const total_passengers = parseInt(adults)+parseInt(children);
    var sql = 'SELECT `FS`.`ID` `FlightScheduleID`,`Origin`, `Destination`, `DepartureTime`, `ArrivalTime`, `DepartureDate`, `ArrivalDate`, `A`.`ID` `AircraftID`, `ModelName`, `Price`, `TC`.`Name` `Name`  FROM `FlightSchedule` `FS` join `State` `S` join `Aircraft` `A` join `AircraftModel` `AM` join `Flight` `F` join `TravelClassPrice` `TCP` join `TravelClass` `TC` join `AvailableSeats` `AST` ON `AST`.`FlightScheduleID` = `FS`.`ID` AND `AST`.`TravelClassID` = `TC`.`ID` AND `FS`.`StateID` = `S`.`ID` and `A`.`ID` = `FS`.`AircraftID` and `A`.`ModelID` = `AM`.`ID` and  `F`.`FlightNo` = `FS`.`FlightNo` and `TCP`.`FlightNo` = `FS`.`FlightNo` and `TCP`.`AircraftID` = `FS`.`AircraftID` and `TCP`.`TravelClassID` = `TC`.`ID` where `origin` = ? and `destination` = ? and `DepartureDate` = ? and `AST`.`TravelClassID` = ? and `AST`.`AvailableNoSeats` >= ?;'
    con.query(sql,[Ffrom,Fto,departing,travelClass,total_passengers], callback);
}

const getAirports = function(con,callback){
    var sql =  'SELECT `AirportCode`, `pl`.`Name` FROM `Airport` join `Location` `cl` on `Airport`.`LocationID` = `cl`.`ID` join `LocationPair` on `cl`.`ID` = `LocationPair`.`ChildLevelID`  join `Location` `pl` on `LocationPair`.`ParentLevelID` = `pl`.`ID`';
    con.query(sql,callback);
    
}

const getAllClasses = function(con,callback){
    var sql = 'SELECT * FROM `TravelClass`';
    con.query(sql,callback);
}

module.exports = {
    getFlightByOrigin,
    getAirports,
    getAllClasses
}