const view_dashboard_get = (TravellerID, dbCon, callback) => {
    let user_sql = "SELECT * FROM `flightschedule` join `booking` on `booking`.`FlightScheduleID`= `flightschedule`.`ID` WHERE `booking`.`TravellerID` = ?";

    dbCon.query(user_sql, TravellerID, callback);
}

const get_states = (dbCon, callback) => {
    const sql = "SELECT * FROM `State`";

    dbCon.query(sql, callback);
}

module.exports= {
    view_dashboard_get
}