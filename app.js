require('dotenv').config();
const express = require('express');
//const expressLayouts = require('express-ejs-layouts');
const morgan =require('morgan');

const searchFlightRoutes = require('./routes/searchFlight-routes');
// const flightSheduleTimeTable = require('./routes/flightSheduleTimeTable');

//express app
const app = express(); 



  
//app.use(expressLayouts);

//db connect
const PORT = process.env.PORT;
const connection = require('./database/dbConnPool');
let dbCon;

connection.getConnection((err, mclient) => {
    if (err) {
        console.log(err.message);
        return;
    }
    console.log('connected to db');
    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
    });

    dbCon = mclient;
});  


app.use(function(req, res, next){
    req.dbCon = dbCon;
    next();
})

//view engine
app.set('view engine', 'ejs');

//middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));

app.use(searchFlightRoutes.routes);
