const save = (data, dbCon, callback) => {
    
    let sql = 'INSERT INTO `passengerdetails`(`BookingID`, `TypeID`, `SeatNo`, `Gender`, `FirstName`, `LastName`, `dateOfBirth`) VALUES(?, ?, ?, ?, ?,?,?)';
    dbCon.query(sql, [1, 1, 1, data.Gender, data.FirstName, data.LastName, data.DateOfBirth], callback);
}

const addBooking = (FlightScheduleID, TravellerID, TravelClassID, BookingStateID, NumPassengers, dbCon, callback) => {
    var sql_booking = 'INSERT INTO `Booking` (`FlightScheduleID`, `TravellerID`,`TravelClassID`, `BookingStateID`, `NumPassengers`, `Bookingdate`, `BookingTime`) VALUES (?,?,?,?,?,?,?)';
    dbCon.query(sql_booking, [FlightScheduleID,TravellerID,TravelClassID,BookingStateID, NumPassengers, null, null], callback);
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

const updateSeatState = (stateID, SeatNo, dbCon, callback) => {
    var sql_update_state = 'UPDATE `seat` SET `SeatStateId` = ? WHERE `seatno` = ? ';
    dbCon.query(sql_update_state, [stateID, SeatNo], callback);
}

const getAvailableCapacity = (SheduleID, dbCon, callback) => {
    var sql_availbale_seat = 'SELECT `AvailableNoSeats` FROM `FlightSchedule` WHERE `ID`= ? ';
    dbCon.query(sql_availbale_seat, [SheduleID], callback);

}

const updateAvailableNoSeats =  (AvailableSeatNo, SheduleID, dbCon, callback) => {
    var sql_update_state = 'UPDATE `FlightSchedule` SET `AvailableNoSeats` = ? WHERE `ID` = ? ';
    dbCon.query(sql_update_state, [AvailableSeatNo, SheduleID], callback);
}

const getTravelClassPrice = (TravelClassID, FlightScheduleID, dbCon, callback) => {
    var sql_travel_class_price = 'SELECT * FROM `TravelClassPrice` `TCP` JOIN `FlightSchedule` `FS` ON `TCP`.`FlightNo` = `FS`.`FlightNo` AND `TCP`.`AircraftID` = `FS`.`AircraftID` WHERE `TCP`.`TravelClassID` = ? AND `FS`.`ID` = ?';
    dbCon.query(sql_travel_class_price, [TravelClassID, FlightScheduleID], callback);

}

const getDiscountPercentage = (RegisteredTravellerID, dbCon, callback) => {
    var sql_dis_per = 'SELECT * FROM `Category` `C` JOIN `RegisteredTraveller` `RT` ON `C`.`ID` = `RT`.`CatagoryID` WHERE `RT`.`ID` = ?';
    dbCon.query(sql_dis_per, [RegisteredTravellerID], callback);

}

const completeBooking = (DiscountAmount,TotalticketPrice, BookingID, BookingDate, BookingTime, dbCon, callback) => {
    var sql_com_booking = 'UPDATE `Booking` SET `DiscountAmount` = ?, `TotalticketPrice` = ?, `BookingStateID` = 2, `BookingDate` = ?, `BookingTime` = ?  WHERE `ID` = ?';
    dbCon.query(sql_com_booking, [DiscountAmount, TotalticketPrice, BookingID, BookingDate, BookingTime], callback)
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
    getSeatsbyTravelClass,
    updateSeatState,
    getAvailableCapacity,
    updateAvailableNoSeats,
    getTravelClassPrice,
    getDiscountPercentage,
    completeBooking
    
}