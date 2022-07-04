const add_flight_schedule = (FlightNo, AircraftID, StateID, DepartureDate, DepartureTime, ArrivalDate, ArrivalTime, dbCon, callback) => {

    const seat_cap_sql = "SELECT `SeatingCapacity` FROM `Aircraft` a join `AircraftModel` m on `a`.`ModelID` = `m`.`ID` where `a`.`ID` = ?";

    dbCon.query(seat_cap_sql, [AircraftID], (err, result, fields) => {
        if(err) throw err;

        const seat_capacity = result[0]["SeatingCapacity"];
        
        const sql = "INSERT INTO `FlightSchedule`(`FlightNo`, `AircraftID`, `StateID`, `DepartureDate`, `DepartureTime`, `ArrivalDate`, `ArrivalTime`, `AvailableNoSeats`, `NoPassengers`) VALUES (?,?,?,?,?,?,?,?,?)";

        dbCon.query(sql, [FlightNo, AircraftID, StateID, DepartureDate, DepartureTime, ArrivalDate, ArrivalTime, seat_capacity, 0], callback);
    })
    
}

const update_flight_schedule = (schedule_id, DepartureDate, DepartureTime, ArrivalDate, ArrivalTime, dbCon, callback) => {


        const sql = "UPDATE `FlightSchedule` SET `DepartureDate` = ?, `DepartureTime` = ?, `ArrivalDate` = ?, `ArrivalTime` = ?, `StateID` = ? WHERE `ID` = ?";

        dbCon.query(sql, [DepartureDate, DepartureTime, ArrivalDate, ArrivalTime, 3, schedule_id], callback);
    
}

const get_schedules_for_day = (Date, dbCon, callback) => {
    const sql_change_to_ontime = "UPDATE `FlightSchedule` SET `StateID` = ? WHERE `DepartureDate` = ? AND `DepartureTime` <= ? AND `StateID` = ?";
    const month = Date.getUTCMonth() + 1;
    const dateformated = Date.getUTCFullYear() + "-" + month +"-" + Date.getUTCDate();
    const time = Date.getHours() + ":" + Date.getMinutes();
    dbCon.query(sql_change_to_ontime, [2, dateformated, time, 1], (err, result, fields) => {

        // const sql = "SELECT * FROM `FlightSchedule` WHERE `DepartureDate` <= ? AND `ArrivalDate` >= ?";
        const sql = "SELECT * FROM `FlightSchedule` WHERE `DepartureDate` <= ? AND `ArrivalDate` >= ?";

        dbCon.query(sql, [Date, Date], callback);
    });
    
}

const get_all_states = (dbCon, callback) => {
    const sql = "SELECT * FROM `State`";

    dbCon.query(sql, callback);
}

module.exports = {
    add_flight_schedule,
    get_schedules_for_day,
    get_all_states,
    update_flight_schedule
}