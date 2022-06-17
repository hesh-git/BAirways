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

        let get_aircrafts_sql = "SELECT * FROM `Aircraft` WHERE `ModelID` = ?";
        dbCon.query(get_aircrafts_sql, [ModelID], (err, result, fields) => {
            if(err) throw err;

            AircraftIDs = []
            result.forEach((value, index, array) => {
                AircraftIDs.push(value["ID"]);
            });

            for(let i = 0; i < AircraftIDs.length; i++) {
                const AircraftID = AircraftIDs[i];

                for(let r=RowStart; r < NumRows + RowStart; r++) {
                    for(let c=1; c <= NumCols; c++) {
                        // create seat number
                        const rowNum = (r + 10).toString(36);
                        const SeatNo = rowNum + c;

                        let seat_sql = "INSERT INTO `Seat`(`SeatNo`, `AircraftID`, `TravelClassID`, `SeatStateID`) VALUES (?,?,?,?)";
                        // seat state available = 1
                        dbCon.query(seat_sql, [SeatNo, AircraftID, TravelClassID, 1], (err, result, fields) => {
                            if(err) throw err;
                        })

                    }
                }
            }
            
        })
    });
}
module.exports = {
    save,
    save_seat_capacity,
    set_database
}