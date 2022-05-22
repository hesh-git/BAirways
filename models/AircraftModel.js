let dbCon;

const set_database = (db) => {
    dbCon = db;
}

const save = (data, dbCon1, callback) => {
    let sql = 'INSERT INTO `aircraftmodel`(`ModelName`, `SeatingCapacity`, `NoOfAircrafts`) VALUES (?,?,?)';
    dbCon.query(sql, [data.ModelName, data.SeatingCapacity, data.NoOfAircrafts], callback);
}

module.exports = {
    save,
    set_database
}