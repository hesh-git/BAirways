const save = (data, dbCon, callback) => {
    console.log(data.ID);
    let sql = 'INSERT INTO `aircraft`(`ID`, `ModelID`) VALUES(?, ?)';
    dbCon.query(sql, [data.ID, data.ModelID], callback);
}

module.exports = {
    save
}