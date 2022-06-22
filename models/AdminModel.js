const getUserByEmail = (email,dbCon,callback) => {
    var sql = 'select * from user where email = ? and UsertypeID = ?';
    dbCon.query(sql,[email,1],callback);
}

const updateLastLog = (id,dbCon,callback) => {
    var sql = 'update authentication set LastLogin = ? where UserID = ? limit 1';
    dbCon.query(sql,[new Date(),id],callback);
}



module.exports={
    getUserByEmail,
    updateLastLog,
}