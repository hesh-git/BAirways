const getPwrdByID = (id,dbCon,callback) =>{
    var sql = 'select password from authentication where UserID = ? limit 1';
    dbCon.query(sql,id,callback);
}

const updateLastLog = (id,dbCon,callback) => {
    var sql = 'update authentication set LastLogin = ? where UserID = ? limit 1';
    dbCon.query(sql,[new Date(),id],callback);
}

const getTravellerID = (id,dbCon,callback) => {
    var sql = 'select TravellerID from authentication join registeredtraveller on authentication.UserID = registeredtraveller.UserID where authentication.UserID = ? limit 1';
    dbCon.query(sql,id,callback);
}


module.exports = {
    getPwrdByID,
    updateLastLog,
    getTravellerID
}