const getUserByEmail = (email,dbCon,callback) => {
    var sql = 'select * from user where email = ? and UsertypeID = ?';
    dbCon.query(sql,[email,1],callback);
}