const save = (FlightNo, Origin, Destination, dbCon, callback) => {
    let sql_route = 'INSERT INTO `route`(`Origin`, `Destination`) VALUES (?, ?)';
    dbCon.query(sql_route, [Origin, Destination], (err, result, fields) => {
        if(err) throw err;

        const RouteID = result.insertId;

        let sql_flight = 'INSERT INTO `flight`(`FlightNo`, `RouteID`, `Origin`, `Destination`) VALUES (?,?,?,?)';
        dbCon.query(sql_flight, [FlightNo, RouteID, Origin, Destination], callback)
    })
}

const get_all_flightNo = (dbCon, callback) => {
    let sql = 'SELECT `FlightNo` FROM `Flight`';
    dbCon.query(sql, callback);
}

const get_flightDetails = (FlightNo, dbCon, callback) => {
    let sql = "SELECT * FROM `Flight` WHERE `FlightNo` = ?";
    dbCon.query(sql, [FlightNo], (err, result, fields) => {
        if(err) throw err;

        return callback(null, result);
    })
    // console.log(results);
}

module.exports = {
    save,
    get_all_flightNo,
    get_flightDetails
}