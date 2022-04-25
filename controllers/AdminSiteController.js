// dashboard
const testModel = require("../models/test")


const dashboard = (req, res) => {
    res.render('./admin/admin_dashboard', {title: 'Admin | Dashboard'});
}

const add_schedule_get = (req, res) => {
    res.render('./admin/add_schedule', {title: 'Add | Flight Schedule'});
}

const add_airport_get = (req, res) => {
    res.render('./admin/add_airport', {title: 'Add | Airport'});
}

const add_aircraft_get = (req, res) => {
    res.render('./admin/add_aircraft', {title: 'Admin | Aircraft'})
}

const add_aircraft_post = (req, res) => {
    console.log(req.body);

//     const connection = require('./database/dbConnPool');
//     connection.getConnection((err, mclient) => {
//     if (err) {
//         console.log(err.message);
//         return;
//     }
//     console.log('connected to db');
//     app.listen(PORT, () => {
//         console.log(`listening on port ${PORT}`);
//     })
// });  

    
    
    testModel.test(req.dbCon, function(error, results) {
        if (error) {
            return console.error(error.message);
        }
        console.log(results);
        })
}

module.exports = {
    dashboard,
    add_schedule_get,
    add_airport_get,
    add_aircraft_get,
    add_aircraft_post
}