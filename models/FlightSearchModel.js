const getFlightByOrigin = function(data, con, callback) {
    const Ffrom = data.Ffrom;
    const Fto = data.Fto;
    const departing = data.departing;
    const returning = data.returning;
    const adults = data.adults;
    const children = data.children;
    const travelClass = data.travelClass;
    var sql = 'SELECT '
    con.query(sql,[data.book, data.Ffrom, data.Fto, data.departing, data.returning, data.adults,  data.children, data.travelClass], callback);
}

const getAirports = function(con,callback){
    var sql =  'SELECT `AirportCode`, `pl`.`Name` FROM `Airport` join `Location` `cl` on `Airport`.`LocationID` = `cl`.`ID` join `LocationPair` on `cl`.`ID` = `LocationPair`.`ChildLevelID`  join `Location` `pl` on `LocationPair`.`ParentLevelID` = `pl`.`ID`';
    con.query(sql,callback);
    
}

const getAllClasses = function(con,callback){
    var sql = 'SELECT * FROM `TravelClass`';
    con.query(sql,callback);
}

module.exports = {
    getFlightByOrigin,
    getAirports,
    getAllClasses
}