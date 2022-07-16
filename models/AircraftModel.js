let dbCon;

const set_database = (db) => {
    dbCon = db;
}

const save = (data, dbCon, callback) => {
    let sql = 'INSERT INTO `aircraftmodel`(`ModelName`, `SeatingCapacity`, `NoOfAircrafts`) VALUES (?,?,?)';
    dbCon.query(sql, [data.ModelName, data.SeatingCapacity, data.NoOfAircrafts], callback);
}

const check_model = (ModelName, dbCon, callback) => {
    const sql = "SELECT * FROM `aircraftmodel` WHERE `ModelName` = ?";
    dbCon.query(sql, [ModelName], callback);
}
const save_seat_capacity = (ModelID, TravelClassID, NumRows, NumCols, dbCon, callback) => {
    let sql = "INSERT INTO `SeatingCapacity`(`ModelID`, `TravelClassID`, `NumRows`, `NumCols`) VALUES (?,?,?,?)";
    dbCon.query(sql, [ModelID, TravelClassID, NumRows, NumCols], (err, result, fields) => {
        if(err) throw err;
    });
}

const get_seat_cap_details = (FlightScheduleID, dbCon, callback) => {

    let sql = "SELECT `SC`.`NumRows`, `SC`.`NumCols`, `SC`.`TravelClassID` FROM `FlightSchedule` `FS` JOIN `Aircraft` `A` JOIN `SeatingCapacity` `SC` ON `FS`.`AircraftID` = `A`.`ID` AND `A`.`ModelID` = `SC`.`ModelID` WHERE `FS`.`ID` = ?";
    dbCon.query(sql, [FlightScheduleID], callback);
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

    const availableNoSeats = NumRows * NumCols;
    const available_seat_sql = "INSERT INTO `AvailableSeats`(`FlightScheduleID`, `TravelClassID`, `AvailableNoSeats`) VALUES (?,?,?)";
    dbCon.query(available_seat_sql, [FlightScheduleID, TravelClassID, availableNoSeats], callback);
}

module.exports = {
    save,
    save_seat_capacity,
    set_database,
    get_seat_cap_details,
    add_seats_to_seat,
    check_model
}