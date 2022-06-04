const searchFlight = function(Ffrom, Fto, departing, returning, requireSeats, travelClass, con, callback) {
    var sql = 'SELECT '
    con.query(sql,[data.book, data.Ffrom, data.Fto, data.departing, data.returning, data.adults,  data.children, data.travelClass], callback);
}

const getAirports = function(con,callback){
    var sql =  'SELECT `AirportCode`, `pl`.`Name` FROM `Airport` join `Location` `cl` on `Airport`.`LocationID` = `cl`.`ID` join `LocationPair` on `cl`.`ID` = `LocationPair`.`ChildLevelID`  join `Location` `pl` on `LocationPair`.`ParentLevelID` = `pl`.`ID`';
    con.query(sql, callback);
    
}

module.exports = {
    searchFlight,
    getAirports
}