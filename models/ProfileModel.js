const viewUserProfile = (TravellerID,dbCon,callback) => {
    let user_sql = "SELECT * FROM `RegisteredTraveller` join `User` on `RegisteredTraveller`.`UserID` = `User`.`ID` WHERE `RegisteredTraveller`.`ID` = ?";
    dbCon.query(user_sql,TravellerID, callback);
}

const editUserProfile = (TravellerID,dbCon,callback) => {

    var sql_user = 'INSERT INTO `user` (`Email`,`UsertypeID`) VALUES (?,?)';  
    
}

module.exports= {
    viewUserProfile,
    editUserProfile
}