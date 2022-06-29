const save = (data, dbCon, callback) => {
    console.log(data.ID);
    let sql = 'INSERT INTO `aircraft`(`ID`, `ModelID`) VALUES(?, ?)';
    dbCon.query(sql, [data.ID, data.ModelID], callback);
}

const get_all_AircraftID = (dbCon, callback) => {
    let sql = 'SELECT `ID` FROM `Aircraft`';
    dbCon.query(sql, callback);
}

const get_AircraftIDs_with_price = (dbCon, callback) => {
    const sql = "SELECT DISTINCT `AircraftID` `ID` FROM `TravelClassPrice`";
    dbCon.query(sql, callback);
}

module.exports = {
    save,
    get_all_AircraftID,
    get_AircraftIDs_with_price
}