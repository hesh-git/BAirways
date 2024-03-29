const get_travellerID = (ID, dbCon, callback) => {
    const sql_traveller_id = "SELECT `T`.`ID` `ID` FROM `RegisteredTraveller` `RT` JOIN `Traveller` `T` ON `RT`.`TravellerID` = `T`.`ID` WHERE `RT`.`ID` = ?";
    dbCon.query(sql_traveller_id, [ID], callback);
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


const getSeatsbyTravelClass = (ScheduleID, TravelClassID, dbCon, callback) => {
    var sql_seats = 'SELECT `SeatNo`, `SeatStateID` from `Seat` `S` WHERE `FlightScheduleID` = ? AND TravelClassID=?';
    dbCon.query(sql_seats, [ScheduleID,TravelClassID], callback);
}

const updateSeatState = (stateID, ScheduleId, SeatNo, dbCon, callback) => {
    // console.log(stateID, ScheduleId, SeatNo, dbCon, callback);
    var sql_update_state = 'UPDATE `seat` SET `SeatStateId` = ? WHERE `seatno` = ? AND `FlightScheduleID` = ?';
    dbCon.query(sql_update_state, [stateID, SeatNo, ScheduleId], callback);
}

const getAvailableCapacity = (SheduleID, dbCon, callback) => {
    var sql_availbale_seat = 'SELECT `AvailableNoSeats`, `NoPassengers` FROM `FlightSchedule` WHERE `ID`= ? ';
    dbCon.query(sql_availbale_seat, [SheduleID], callback);

}

const updateAvailableNoSeats =  (passenger_count, AvailableSeatNo, NoPassengers, SheduleID, TravelClassID, dbCon, callback) => {
    var sql_update_state = 'UPDATE `FlightSchedule` SET `AvailableNoSeats` = ?, `NoPassengers` = ? WHERE `ID` = ? ';
    dbCon.query(sql_update_state, [AvailableSeatNo, NoPassengers, SheduleID], (err, result, fields) => {
        if(err) throw err;

        const sql_available_seat = "SELECT `AvailableNoSeats` FROM `AvailableSeats` WHERE `FlightScheduleID` = ? AND `TravelClassID` = ?";
        dbCon.query(sql_available_seat, [SheduleID, TravelClassID], (err, result, fields) => {
            if(err) throw err;

            let no_seats = result[0]["AvailableNoSeats"];
            no_seats -= passenger_count;
            const sql_update_no_seats = "UPDATE `AvailableSeats` SET `AvailableNoSeats` = ? WHERE `FlightScheduleID` = ? AND `TravelClassID` = ?";
            dbCon.query(sql_update_no_seats, [no_seats, SheduleID, TravelClassID], callback);
        })
    });
}

const getTravelClassPrice = (TravelClassID, FlightScheduleID, dbCon, callback) => {
    var sql_travel_class_price = 'SELECT * FROM `TravelClassPrice` `TCP` JOIN `FlightSchedule` `FS` ON `TCP`.`FlightNo` = `FS`.`FlightNo` AND `TCP`.`AircraftID` = `FS`.`AircraftID` WHERE `TCP`.`TravelClassID` = ? AND `FS`.`ID` = ?';
    dbCon.query(sql_travel_class_price, [TravelClassID, FlightScheduleID], callback);

}

const getDiscountPercentage = (TravellerID, dbCon, callback) => {
    var sql_dis_per = 'SELECT * FROM `Category` `C` JOIN `RegisteredTraveller` `RT` ON `C`.`ID` = `RT`.`CatagoryID` WHERE `RT`.`TravellerID` = ?';
    dbCon.query(sql_dis_per, [TravellerID], callback);

}

const getPassengers = (BookingID, dbCon, callback) => {
    var sql_pas = 'SELECT `ID` FROM `passengerdetails` WHERE `BookingID` = ?';
    dbCon.query(sql_pas, [BookingID], callback);
}

const addSeatNumber = (SeatNo, ID, dbCon, callback) => {
    var sql_add_seat_num = 'UPDATE `passengerdetails` SET `SeatNo`= ? WHERE `ID` = ?';
    dbCon.query(sql_add_seat_num, [SeatNo, ID], callback);
}

const getNoBookings = (TravellerID, dbCon, callback) => {
    var sql_num_bookings = 'SELECT `NumBookings` FROM `registeredtraveller` WHERE `TravellerID`= ? ';
    dbCon.query(sql_num_bookings, [TravellerID], callback);

}

const updateNoBooking =  (NumBookings, TravellerID, dbCon, callback) => {
    var sql_upadate_num_bookings = 'UPDATE `registeredtraveller` SET `NumBookings` = ? WHERE `TravellerID` = ? ';
    dbCon.query(sql_upadate_num_bookings, [NumBookings, TravellerID], callback);
}

const completeBooking = (DiscountAmount,TotalticketPrice, BookingID, BookingDate, BookingTime, dbCon, callback) => {
    var sql_com_booking = 'UPDATE `Booking` SET `DiscountAmount` = ?, `TotalticketPrice` = ?, `BookingStateID` = 2, `BookingDate` = ?, `BookingTime` = ?  WHERE `ID` = ?';
    dbCon.query(sql_com_booking, [DiscountAmount, TotalticketPrice, BookingDate, BookingTime, BookingID], callback)
}




module.exports = {
    addPassenger,
    addBooking,
    addTraveller, 
    addGuest,
    getCapacity,
    getCapacitybyTravelClass,
    getSeatsbyTravelClass,
    updateSeatState,
    getAvailableCapacity,
    updateAvailableNoSeats,
    getTravelClassPrice,
    getDiscountPercentage,
    getPassengers,
    addSeatNumber,
    getNoBookings,
    updateNoBooking,
    completeBooking,
    get_travellerID
    
}