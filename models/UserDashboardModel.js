const view_dashboard_get = (RegisteredID, dbCon, callback) => {
    let user_sql = "SELECT * FROM `flightschedule` `FS` join `booking` `BK` join `RegisteredTraveller` `RT` on `BK`.`FlightScheduleID`= `FS`.`ID` AND `BK`.`TravellerID` = `RT`.`TravellerID` WHERE `RT`.`ID` = ? AND `BK`.`BookingStateID` = ?";

    dbCon.query(user_sql, [RegisteredID, 2], callback);
}

const get_states = (dbCon, callback) => {
    const sql = "SELECT * FROM `State`";

    dbCon.query(sql, callback);
}

module.exports= {
    view_dashboard_get
}