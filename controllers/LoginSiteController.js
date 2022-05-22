const userModel = require('../models/userModel');
const authModel = require('../models/autheticationModel');

const login_page = (req,res) => {
    res.render('login', {title: 'Login Page'})
}

const signup_page = (req,res) => {
    res.render('signup', {title: 'Signup Page'})
}

const login_post = (req,res,next) => {
    const con = req.dbCon;
    var email = req.body.email;
    var password =req.body.password;
    
    userModel.getUserByEmail(email,con, function(err,result, fields){
        console.log(result);
        if(err) throw err;
        if(!result.length){
          res.send('Not logged in');
        }
  
        var id = result[0].ID;
        
        authModel.getPwrdByID(id, con, function(err,result, fields){
            if(err) throw err;
            //console.log(result);
            if(result.length && result[0].password == password){
                authModel.updateLastLog(id,con, function(err,result,fields){
                    if (err) throw err;   
                    req.session.email = email;
                    res.send('Logged');
                })
            }else{
            req.session.flag = 4;
            res.send('Not logged');
            }
        });
      });
  }

  const signup_post = (req,res,next) => {
        const data = req.body;
        const dbCon = req.dbCon;

        const fName = data.fName;
        const lName = data.lName;
        const email = data.email;
        const password = data.password;
        const conPassword = data.conPassword;
        const contact = data.contact;

        

        //userModel.getUserByEmail(email,dbCon,function(err,result, fields){
            //if(result == []){
                userModel.addUser(fName,lName,email,password,contact,dbCon,function(err,result, fields){
                    console.log(result);
                    if(err)
                        throw err
                    res.send('User entered');
                })
            //}
        //})

  }

module.exports = {
    login_page,
    signup_page,
    login_post,
    signup_post
}