const viewUserProfile = (TravellerID,dbCon,callback) => {
    let user_sql = "SELECT * FROM `RegisteredTraveller` join `User` on `RegisteredTraveller`.`UserID` = `User`.`ID` WHERE `RegisteredTraveller`.`TravellerID` = ?";
    dbCon.query(user_sql,TravellerID, callback);
}

const editUserProfile = (TravellerID,dbCon,callback) => {

    console.log(fName,lName,email)
    var sql_user = 'INSERT INTO `user` (`Email`,`UsertypeID`) VALUES (?,?)';  
    
}

module.exports= {
    viewUserProfile,
    editUserProfile
}