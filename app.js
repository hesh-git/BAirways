require('dotenv').config();
const express = require('express');
const morgan =require('morgan');
const path = require('path');
const mysql = require('mysql');
const session = require('express-session');
const loginRoutes = require('./routes/LoginRoutes');

const port = 3000;

//express app
const app = express(); 

//db connect
const PORT = process.env.PORT;
const connection = require('./database/dbConnPool');
connection.getConnection((err, mclient) => {
    if (err) {
        console.log(err.message);
        return;
    }
    console.log('connected to db');
    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
    })
});  



//view engine
app.set('view engine', 'ejs');

//middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));

//login page route
app.use('/', loginRoutes)

app.listen(port, () => {console.log('Listening to server on  localhost:3000')});