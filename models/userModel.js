const getUserByEmail = (email,dbCon,callback) => {
    var sql = 'select * from user where email = ?';
    dbCon.query(sql,email,callback);
}


const addUser = (fName,lName,email,password,contact, dbCon,callback) =>{
    console.log(fName,lName,email,password,contact)
    var sql_user = 'INSERT INTO `user` (`Email`,`UsertypeID`) VALUES (?,?)';
    dbCon.query(sql_user,[email,2],(err,result,fields) =>{
        if(err){
            throw err
        }
        var userID = result.insertId;
        var sql_auth = 'INSERT INTO `authentication` (`Password`, `UserID`) VALUES (?,?)';

        dbCon.query(sql_auth,[password,userID],(err,result,fields) => {
            if(err){
                throw err
            }

        })

        var sql_traveller = 'INSERT INTO `traveller` (`TypeID`) VALUES (?)';
        dbCon.query(sql_traveller,[1],(err,result,fields) => {
            if(err){
                throw err
            }
            var travellerID = result.insertId;
            var sql_rtraveller = 'INSERT INTO `registeredtraveller` (`UserID`,`TravellerID`,`CatagoryID`,`FirstName`,`LastName`,`ContactNumber`) VALUES (?,?,?,?,?,?)';
            dbCon.query(sql_rtraveller,[userID,travellerID,1,fName,lName,contact], callback);

        })
    });
    
}

module.exports= {
    getUserByEmail,
    addUser
}