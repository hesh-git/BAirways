const view_dashboard_get = (RegisteredID, dbCon, callback) => {
    const today = new Date();
    const sql_change_to_ontime_today = "UPDATE `FlightSchedule` SET `StateID` = ? WHERE `DepartureDate` = ? AND `DepartureTime` <= ? AND `StateID` = ?";
    const month = today.getUTCMonth() + 1;
    const dateformated = today.getUTCFullYear() + "-" + month +"-" + today.getUTCDate();
    const time = today.getHours() + ":" + today.getMinutes();
    dbCon.query(sql_change_to_ontime_today, [2, dateformated, time, 1], (err, result, fields) => {
        const sql_change_to_ontime_past = "UPDATE `FlightSchedule` SET `StateID` = ? WHERE `DepartureDate` < ? AND `StateID` = ?";
        dbCon.query(sql_change_to_ontime_past, [2, dateformated, 1], (err, result, fields) => {
            let user_sql = "SELECT * FROM `flightschedule` `FS` join `booking` `BK` join `RegisteredTraveller` `RT` on `BK`.`FlightScheduleID`= `FS`.`ID` AND `BK`.`TravellerID` = `RT`.`TravellerID` WHERE `RT`.`ID` = ? AND `BK`.`BookingStateID` = ?";

            dbCon.query(user_sql, [RegisteredID, 2], callback);
        });
        
    });
}

const get_states = (dbCon, callback) => {
    const sql = "SELECT * FROM `State`";

    dbCon.query(sql, callback);
}

module.exports= {
    view_dashboard_get
}