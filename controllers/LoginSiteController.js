const userModel = require('../models/userModel');
const authModel = require('../models/autheticationModel');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require("express-validator");


const maxValidity = 3*24*60*60; //validity period of jwt

const createToken = (id,userType) => {
    return jwt.sign({id, userType}, 'B airways secret',{
        expiresIn: maxValidity
    });
}


const login_page = (req,res) => {
    res.render('login', {title: 'Login Page', layout: './layouts/auth_layout'})
}

const signup_page = (req,res) => {
    res.render('signup', {title: 'Signup Page', layout: './layouts/auth_layout'})
}

const login_post = (req,res,next) => {
    const con = req.dbCon;
    var email = req.body.email;
    var password =req.body.password;

    const errors = validationResult(req)
        if(!errors.isEmpty()) {
            // return res.status(422).jsonp(errors.array())
            const alert = errors.array()[0]
            console.log(alert)
            res.render('login', {
                 title: 'Login Page', layout: './layouts/auth_layout',alert
            })
        }
        else{
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

        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            // return res.status(422).jsonp(errors.array())
            const alert = errors.array()[0]
            console.log(alert)
            res.render('signup', {
                 title: 'Signup Page', layout: './layouts/auth_layout',alert
            })
        }
        else{        
            userModel.addUser(fName,lName,email,password,contact,dbCon,function(err,result, fields){
            if(err)
                throw err
            
            const token = createToken(result.insertId, 'traveller'); 
            res.cookie('jwt', token, {httpOnly: true, maxValidity: maxValidity*1000});
            //res.send('User entered');
            //res.status(201).json({user: result.insertId});
            //console.log(result)   
            
        })}

  }

module.exports = {
    login_page,
    signup_page,
    login_post,
    signup_post
}