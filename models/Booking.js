const save = (data, dbCon, callback) => {
    
    let sql = 'INSERT INTO `passengerdetails`(`BookingID`, `TypeID`, `SeatNo`, `Gender`, `FirstName`, `LastName`, `dateOfBirth`) VALUES(?, ?, ?, ?, ?,?,?)';
    dbCon.query(sql, [1, 1, 1, data.Gender, data.FirstName, data.LastName, data.DateOfBirth], callback);
}

const addBooking = (FlightScheduleID, TravellerID, TravelClassID, BookingStateID, dbCon, callback) => {
    var sql_booking = 'INSERT INTO `Booking` (`FlightScheduleID`, `TravellerID`,`TravelClassID`, `BookingStateID`) VALUES (?,?,?,?)';
    dbCon.query(sql_booking, [FlightScheduleID,TravellerID,TravelClassID,BookingStateID], callback);
}

const addPassenger = ( BookingID, TypeID, Gender, FirstName, LastName, DateOfBirth, dbCon, callback) => {
    var sql_passenger = 'INSERT INTO `passengerdetails` (`BookingID`, `TypeID`, `Gender`, `FirstName`, `LastName`, `DateOfBirth`) VALUES (?,?,?,?,?,?)';
    dbCon.query(sql_passenger, [BookingID, TypeID, Gender, FirstName, LastName, DateOfBirth], callback);
    
}

const addTraveller = (dbCon, callback) => {
    var sql_traveller = 'INSERT INTO `traveller` (`TypeID`) VALUES (?)';
    dbCon.query(sql_traveller, [2], callback);
}

const addGuest = (TravelerID, FirstName, LastName, Email, ContactNumber, dbCon, callback) => {
    var sql_guest = 'INSERT INTO `guest` (`TravelerID`, `FirstName`, `LastName`, `Email`, `ContactNumber`) VALUES (?,?,?,?,?)';
    dbCon.query(sql_guest,[TravelerID, FirstName, LastName, Email, ContactNumber], callback);
}

module.exports = {
    save,
    addPassenger,
    addBooking,
    addTraveller, 
    addGuest
}