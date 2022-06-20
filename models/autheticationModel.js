const getPwrdByID = (id,dbCon,callback) =>{
    var sql = 'select password from authentication where UserID = ? limit 1';
    dbCon.query(sql,id,callback);
}

const updateLastLog = (id,dbCon,callback) => {
    var sql = 'update authentication set LastLogin = ? where UserID = ? limit 1';
    dbCon.query(sql,[new Date(),id],callback);
}


module.exports = {
    getPwrdByID,
    updateLastLog
}