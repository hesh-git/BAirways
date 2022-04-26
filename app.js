require('dotenv').config();
const express = require('express');
const morgan =require('morgan');
const path = require('path');
const mysql = require('mysql');
const bodyParser=require('body-parser');
const session = require('express-session');
const loginRoutes = require('./routes/Auth');

const port = 3000;

//express app
const app = express(); 

app.use(session({
    secret : 'ABCDefg',
    resave : false,
    saveUninitialized : true
  }));

//db connect
const PORT = process.env.PORT;
const connection = require('./database/dbConnPool');
let dbCon;

connection.getConnection((err, mclient) => {
    if (err) {
        console.log(err.message);
        return;
    }
    console.log('connected to DB');
    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
    });

    dbCon = mclient;
});  



//view engine
app.set('view engine', 'ejs');

app.use(function(req,res, next) {
    req.dbCon = dbCon;
    next()
})

//middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(morgan('dev'));

//login page route
app.use('/', loginRoutes);
app.use('/register', loginRoutes);
app.use('/auth', loginRoutes);

