const save = (data, dbCon, callback) => {
    
    let sql = 'INSERT INTO `passengerdetails`(`BookingID`, `TypeID`, `SeatNo`, `Gender`, `FirstName`, `LastName`, `dateOfBirth`) VALUES(?, ?, ?, ?, ?,?,?)';
    dbCon.query(sql, [1, 1, 1, data.Gender, data.FirstName, data.LastName, data.DateOfBirth], callback);
}

const addBooking = (FlightScheduleID, TravellerID, TravelClassID, BookingStateID, dbCon, callback) =>{
    var sql_booking = 'INSERT INTO `Booking` (`FlightScheduleID`, `TravellerID`,`TravelClassID`, `BookingStateID`) VALUES (?,?,?,?)';
    dbCon.query(sql_booking, [FlightScheduleID,TravellerID,TravelClassID,BookingStateID], callback);
}

const addPassenger = ( BookingID, TypeID, Gender, FirstName, LastName, DateOfBirth, dbCon, callback) =>{
    
    var sql_passenger = 'INSERT INTO `passengerdetails` (`BookingID`, `TypeID`, `Gender`, `FirstName`, `LastName`, `DateOfBirth`) VALUES (?,?,?,?,?,?)';
    dbCon.query(sql_passenger, [BookingID, TypeID, Gender, FirstName, LastName, DateOfBirth], callback);
    
}

module.exports = {
    save,
    addPassenger,
    addBooking
}