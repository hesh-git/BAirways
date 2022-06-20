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

const getCapacitybyTravelClass = (ScheduleId, TravelClassID, dbCon, callback) =>{
    var sql_capacity = 'SELECT `NumRows`, `NumCols` From `FlightSchedule` `FS` JOIN `Aircraft` `A` JOIN `SeatingCapacity` `SC` on FS.AircraftID = A.ID AND A.ModelID = SC.ModelID where FS.ID=? AND SC.TravelClassID=?';
    dbCon.query(sql_capacity,[ScheduleId, TravelClassID], callback);
}

const getCapacity = (ScheduleId, dbCon, callback) =>{
    var sql_capacity = 'SELECT `NumRows`, `NumCols`, `TravelClassID` From `FlightSchedule` `FS` JOIN `Aircraft` `A` JOIN `SeatingCapacity` `SC` on FS.AircraftID = A.ID AND A.ModelID = SC.ModelID where FS.ID=?';
    dbCon.query(sql_capacity,[ScheduleId], callback);
}

const getSeatsbyState = (ScheduleID, TravelClassID, SeatStateID, dbCon, callback) => {
    var sql_seats = 'SELECT `SeatNo` from `Seat` `S` JOIN `FlightSchedule` `FS` on S.AircraftID = FS.AircraftID where FS.ID=? AND S.TravelClassID=? AND S.SeatStateID=?';
    dbCon.query(sql_seats, [ScheduleID,TravelClassID, SeatStateID], callback);
}

const getSeatsbyTravelClass = (ScheduleID, TravelClassID, dbCon, callback) => {
    var sql_seats = 'SELECT `SeatNo`, `SeatStateID` from `Seat` `S` JOIN `FlightSchedule` `FS` on S.AircraftID = FS.AircraftID where FS.ID=? AND S.TravelClassID=?';
    dbCon.query(sql_seats, [ScheduleID,TravelClassID], callback);
}

const getSeats = (ScheduleID, dbCon, callback) => {
    var sql_seats = 'SELECT `SeatNo`, `TravelClassID`, `SeatStateID` from `Seat` `S` JOIN `FlightSchedule` `FS` on S.AircraftID = FS.AircraftID where FS.ID=?';
    dbCon.query(sql_seats, [ScheduleID], callback);
}

module.exports = {
    save,
    addPassenger,
    addBooking,
    addTraveller, 
    addGuest,
    getCapacity,
    getCapacitybyTravelClass,
    getSeats,
    getSeatsbyState,
    getSeatsbyTravelClass
}