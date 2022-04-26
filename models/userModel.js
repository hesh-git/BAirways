const getUserByEmail = (email,dbCon,callback) => {
    var sql = 'select * from user where email = ?';
    dbCon.query(sql,email,callback);
}

module.exports= {
    getUserByEmail
}