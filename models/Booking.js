const save = (data, dbCon, callback) => {
    
    let sql = 'INSERT INTO `passengerdetails`(`BookingID`, `TypeID`, `SeatNo`, `Gender`, `FirstName`, `LastName`, `dateOfBirth`) VALUES(?, ?, ?, ?, ?,?,?)';
    dbCon.query(sql, [1, 1, 1, data.Gender, data.FirstName, data.LastName, data.DateOfBirth], callback);
}

module.exports = {
    save
}