const save = (data, dbCon, callback) => {
    let sql = 'INSERT INTO `aircraftmodel`(`ModelName`, `SeatingCapacity`, `NoOfAircrafts`) VALUES (?,?,?)';
    dbCon.query(sql, [data.ModelName, data.SeatingCapacity, data.NoOfAircrafts], callback);
}

module.exports = {
    save
}