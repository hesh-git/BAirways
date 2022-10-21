const getPwrdByID = (id,dbCon,callback) =>{
    var sql = 'select password from authentication USE INDEX(`idx_userid`) where UserID = ? limit 1';
    dbCon.query(sql,id,callback);
}

const updateLastLog = (id,dbCon,callback) => {
    var sql = 'update authentication set LastLogin = ? where UserID = ? limit 1';
    dbCon.query(sql,[new Date(),id],callback);
}

const getTravellerID = (id,dbCon,callback) => {
    var sql = 'select `RT`.`ID` `RegisteredID` from authentication join `registeredtraveller` `RT` on authentication.UserID = `RT`.UserID where authentication.UserID = ? limit 1';
    dbCon.query(sql,id,callback);
}


module.exports = {
    getPwrdByID,
    updateLastLog,
    getTravellerID
}