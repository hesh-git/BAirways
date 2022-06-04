const save = (FlightNo, Origin, Destination, dbCon, callback) => {
    let sql_route = 'INSERT INTO `route`(`Origin`, `Destination`) VALUES (?, ?)';
    dbCon.query(sql_route, [Origin, Destination], (err, result, fields) => {
        if(err) throw err;

        const RouteID = result.insertId;

        let sql_flight = 'INSERT INTO `flight`(`FlightNo`, `RouteID`, `Origin`, `Destination`) VALUES (?,?,?,?)';
        dbCon.query(sql_flight, [FlightNo, RouteID, Origin, Destination], callback)
    })
}

module.exports = {
    save
}