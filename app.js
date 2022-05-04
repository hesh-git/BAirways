require('dotenv').config();
const express = require('express');
const morgan =require('morgan');
const adminRoutes = require('./routes/AdminRoutes');
const expressLayouts = require('express-ejs-layouts');

//express app
const app = express(); 

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



//view engine
app.set('view engine', 'ejs');

// layouts
app.use(expressLayouts);

app.use(function(req, res, next) {
    req.dbCon = dbCon;
    next()
  })

//middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));

// admin site routes
app.use('/admin', adminRoutes);

