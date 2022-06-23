let dbCon;

const set_database = (db) => {
    dbCon = db;
}

const save = (data, dbCon1, callback) => {
    let sql = 'INSERT INTO `aircraftmodel`(`ModelName`, `SeatingCapacity`, `NoOfAircrafts`) VALUES (?,?,?)';
    dbCon.query(sql, [data.ModelName, data.SeatingCapacity, data.NoOfAircrafts], callback);
}

const save_seat_capacity = (ModelID, TravelClassID, RowStart, NumRows, NumCols, dbCon, callback) => {
    let sql = "INSERT INTO `SeatingCapacity`(`ModelID`, `TravelClassID`, `NumRows`, `NumCols`) VALUES (?,?,?,?)";
    dbCon.query(sql, [ModelID, TravelClassID, NumRows, NumCols], (err, result, fields) => {
        if(err) throw err;
    });
}

const get_seat_cap_details = (FlightScheduleID, TravelClassID, dbCon, callback) => {
    let sql = "SELECT `NumRows`, `NumCols` WHERE `FlightSchedule` `FS` JOIN `Aircraft` `A` JOIN `SeatingCapacity` `SC` ON `FS`.`AircraftID` = `A`.`ID` AND `A`.`ModelID` = `SC`.`ModelID` WHERE `FS`.`ID` = ? AND `SC`.`TravelClassID`= ?";
    dbCon.query(sql, [FlightScheduleID, TravelClassID], callback);
}

const add_seats_to_seat = (FlightScheduleID, TravelClassID, RowStart, NumRows, NumCols, dbCon, callback) => {
    for(let r=RowStart; r < NumRows + RowStart; r++) {
        for(let c=1; c <= NumCols; c++) {
            // create seat number
            const rowNum = (r + 10).toString(36);
            const SeatNo = rowNum + c;

            let seat_sql = "INSERT INTO `Seat`(`SeatNo`, `FlightScheduleID`, `TravelClassID`, `SeatStateID`) VALUES (?,?,?,?)";
            // seat state available = 1
            dbCon.query(seat_sql, [SeatNo, FlightScheduleID, TravelClassID, 1], (err, result, fields) => {
                if(err) throw err;
            })

        }
    }
}
module.exports = {
    save,
    save_seat_capacity,
    set_database,
    get_seat_cap_details,
    add_seats_to_seat
}