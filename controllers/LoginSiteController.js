const userModel = require('../models/userModel');
const authModel = require('../models/autheticationModel');
const adminModel = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require("express-validator");
const passwordHash = require('password-hash');
const maxValidity = 3*24*60*60; //validity period of jwt

const createToken = (id,userType) => {
    return jwt.sign({id, userType}, 'B airways secret',{
        expiresIn: maxValidity
    });
}

const login_page = (req,res) => {
    res.render('login', {title: 'User | Login', layout: './layouts/auth_layout'})
}

const admin_login_get = (req,res) => {
    res.render('AdminLogin', {title: 'Admin | Login', layout: './layouts/auth_layout'})
}

const admin_logout_get = (req,res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/adminlogin');
}

const user_logout_get = (req,res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/');
}

const signup_page = (req,res) => {
    res.render('signup', {title: 'User | Signup', layout: './layouts/auth_layout'})
}

const admin_login_post = (req,res,next) => {
    const con = req.dbCon;
    var email = req.body.email;
    var password =req.body.password;

    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        const alert = errors.array()[0].msg

        req.flash('error', alert);
        
        res.redirect('/adminlogin');
    }
    else{
        adminModel.getUserByEmail(email,con, function(err,result, fields){
            if(err) {
                return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
            }

            if(result.length == 0){
                req.flash('error',"Invalid login. Please try again");
                return res.redirect('/adminlogin');
            }
            var id = result[0].ID;
            
            authModel.getPwrdByID(id, con, function(err,result, fields){
                if(err) {
                    return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                }
                const hashedPassword = result[0].password;
                const comparison = passwordHash.verify(password,hashedPassword);
                if(result.length && comparison){
                    authModel.updateLastLog(id,con, function(err,result,fields){
                        if(err) {
                            return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                        }  
                        req.session.email = email;
                        const token = createToken(id, 'admin'); 
                        res.cookie('jwt', token, {httpOnly: true, maxValidity: maxValidity*1000});
                            //res.send("Email and password matched. Logged");
                        res.redirect('/admin');        
                    })
                }else{
                // req.session.flag = 4;
                    req.flash('error', 'Email and password did not match');
                    res.redirect('/adminlogin');
                }
            });
        })
    }
}

const login_post = (req,res,next) => {
    const con = req.dbCon;
    var email = req.body.email;
    var password =req.body.password;

    const errors = validationResult(req)
        if(!errors.isEmpty()) {
            const alert = errors.array()[0].msg
            req.flash('error', alert);
            res.redirect('/');
        }
        else{
            userModel.getUserByEmail(email,con, function(err,result, fields){
                if(err) {
                    return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                }
                if(result.length == 0){
                  req.flash('error',"You don't have an account with us. Please sign up");
                  res.redirect('/register');
                } else {
                    var id = result[0].ID;
                    
                    authModel.getPwrdByID(id, con, function(err,result, fields){
                        if(err) {
                            return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                        }

                        const hashedPassword = result[0].password;
                        const comparison = passwordHash.verify(password,hashedPassword);
                        if(result.length && comparison){
                            authModel.updateLastLog(id,con, function(err,result,fields){
                                if(err) {
                                    return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                                } 
                                req.session.email = email;
                                authModel.getTravellerID(id,con,function(err,result,fields){
                                    if(err) {
                                        return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                                    }

                                    const RegisteredID = result[0].RegisteredID;
                                    const token = createToken(RegisteredID, 'traveller'); 
                                    res.cookie('jwt', token, {httpOnly: true, maxValidity: maxValidity*1000});
                                    //res.send("Email and password matched. Logged");
                                    res.redirect('/user/profile');
                                })
                            })
                        }   else{
                            req.flash('error', 'Email and password did not match. Not logged in');
                            res.redirect('/')
                        }
                    });
                }});
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
        const encryptedPassword = passwordHash.generate(password);

        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            // return res.status(422).jsonp(errors.array())
            const alert = errors.array()[0].msg
            req.flash('error', alert);
            res.redirect('/register');
        }
        else{  
            userModel.getUserByEmail(email,dbCon,function(err,result,fields){
                if(err) {
                    return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                } else if(result.length != 0){
                    req.flash('error', 'Email already exists');
                    res.redirect('/register');
                }else{
                    console.log(result);
                    userModel.addUser(fName,lName,email,encryptedPassword,contact,dbCon,function(err,result, fields){
                        if(err) {
                            return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                        }
                        const token = createToken(result.insertId, 'traveller'); 
                        res.cookie('jwt', token, {httpOnly: true, maxValidity: maxValidity*1000});
                        res.redirect('/user/profile');
                        //res.status(201).json({user: result.insertId});  
                        
                    })
                }
            })     
        }
  }

module.exports = {
    login_page,
    signup_page,
    login_post,
    signup_post,
    admin_login_get,
    admin_login_post,
    admin_logout_get,
    user_logout_get
}