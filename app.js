require('dotenv').config();

const moment = require("moment");
const express = require('express');
const flash = require('connect-flash');


//const expressLayouts = require('express-ejs-layouts');
const morgan =require('morgan')

// const flash = require('express-flash')


const searchFlightRoutes = require('./routes/searchFlight-routes')

const bookingRoutes = require('./routes/BookingRoutes')

const adminRoutes = require('./routes/AdminRoutes')
const expressLayouts = require('express-ejs-layouts')

const path = require('path')
const mysql = require('mysql');
const bodyParser=require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const loginRoutes = require('./routes/Auth');

const userRoutes = require('./routes/UserRoutes');

const {requireAuth, checkUser, requireAuthAdmin} = require('./middleware/AuthMiddleware');



//express app
const app = express(); 

app.use(session({
    secret : 'ABCDefg',
    resave : false,
    saveUninitialized : true,
    cookie: { maxAge: 3*24*60*60*1000 },
    expires: new Date(Date.now() + (3*24*60*60*1000))
  }));

app.use(flash());

app.use((req, res, next)=>{
    res.locals.moment = moment;
    next();
});

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


app.use(function(req, res, next){
    req.dbCon = dbCon;
    next();
})

//view engine
app.set('view engine', 'ejs');


// layouts
app.use(expressLayouts);

app.use(function(req, res, next) {
    req.dbCon = dbCon;
    next()
});

app.use(function(req, res, next) {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})


//middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));

app.get('*',checkUser)

app.use(searchFlightRoutes.routes);
app.use(bookingRoutes);

// admin site routes

app.use('/admin',requireAuthAdmin, adminRoutes);

app.use(express.json());

//login page route
app.use('/', loginRoutes);
app.use('/register', loginRoutes);
app.use('/auth', loginRoutes);
app.use('/user',requireAuth, userRoutes);

app.use((req, res) => {
    res.status(404).render('error', { title : '404', layout: "./layouts/payment_layout", error: {"msg": "Page Not Found", "status": 404}});
}); 


