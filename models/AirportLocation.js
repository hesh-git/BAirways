// save location name to location table
const save_to_location = (name, dbCon, callback) => {
    let sql = 'INSERT INTO `Location` (`Name`) VALUES (?)';
    dbCon.query(sql, [name], callback);
}

// create location pairs
const save_location_pair = (parentLevelID, childLevelID, dbCon, callback) => {
    let sql = 'INSERT INTO `LocationPair` (`ParentLevelID`, `ChildLevelID`) VALUES (?, ?)';
    dbCon.query(sql, [parentLevelID, childLevelID], callback);
}

// save airport code to Airport table
const save_airport_code = (airportCode, locationID, dbCon, callback) => {
    let sql = 'INSERT INTO `Airport` (`AirportCode`, `LocationID`) VALUES (?,?)';
    dbCon.query(sql, [airportCode, locationID], callback);
}

const get_all_airports = (dbCon, callback) => {
    let sql = 'SELECT `AirportCode` FROM `airport`';
    dbCon.query(sql, callback);
}

const check_airport_code = (AirportCode, dbCon, callback) => {
    const sql = "SELECT * FROM `airport` WHERE `AirportCode` = ?";
    dbCon.query(sql, [AirportCode], callback);
}

module.exports = {
    save_to_location,
    save_location_pair,
    save_airport_code,
    get_all_airports,
    check_airport_code
}