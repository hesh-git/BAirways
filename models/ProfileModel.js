const viewUserProfile = (TravellerID,dbCon,callback) => {
    let user_sql = "SELECT * FROM `RegisteredTraveller` join `User` on `RegisteredTraveller`.`UserID` = `User`.`ID` WHERE `RegisteredTraveller`.`TravellerID` = ?";
    dbCon.query(user_sql,TravellerID, callback);
}

module.exports= {
    viewUserProfile
}