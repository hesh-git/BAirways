const ProfileModel = require("../models/ProfileModel");
const UserDashboardModel = require("../models/UserDashboardModel");

const view_profile_get = (req, res) => {
    const con = req.dbCon;

    const TravellerID = 4;
    ProfileModel.viewUserProfile(TravellerID,con,(err,result,fields)=>{
        if (err) throw err;
        console.log(result);
            
            const userDetail = {
                'fName': result[0]['FirstName'],
                'lName': result[0]['LastName'],
                'email': result[0]['Email'],
                'ContactNumber': result[0]['ContactNumber']
            }
            res.render('./reg_user/user_profile', {title: 'user | Profile',userDetail:userDetail, layout: './layouts/user_layout'});
        })
        

const view_dashboard_get = (req, res) => {
    const dbCon = req.dbCon;

    UserDashboardModel.view_dashboard_get(TravellerID, dbCon, (err, schedules1, fields) => {
        if(err) throw err;

        FlightSchedule.get_all_states(dbCon, (err, states, fields) => {
            if(err) throw err;

            const state_list = {}; // states as key=>value paires
            

            states.forEach((value, index, array) => {
                state_list[value["ID"]] = value["NAME"];
            });

            FlightModel.get_all_flightNo(dbCon, (err, flight_details, fields) => {
                if(err) throw err;

                const flights_list = {}; // flights as key=>value paires

                flight_details.forEach((value, index, array) => {
                    flights_list[value["FlightNo"]] = {"Origin": value["Origin"], "Destination": value["Destination"]};
                });

                schedules.forEach((value, index, array) => {
                    value["State"] = state_list[value["StateID"]];
                    value['Origin'] = flights_list[value["FlightNo"]]["Origin"];
                    value['Destination'] = flights_list[value["FlightNo"]]["Destination"];

                    const DepartureDate = value["DepartureDate"];
                    const DepartureTime = value["DepartureTime"].split(":");
                    const ArrivalDate = value["ArrivalDate"];
                    const ArrivalTime = value["ArrivalTime"].split(":");

                    let days = (ArrivalDate.getTime()- DepartureDate.getTime()) / (1000 * 3600 * 24);
                    let hours = ArrivalTime[0] - DepartureTime[0];
                    let minutes = ArrivalTime[1] - DepartureTime[0];


                    if(hours < 0) {
                        days -= 1;
                        hours = 24 + hours;
                    }

                    if(minutes < 0) {
                        hours -= 1;
                        minutes = 60 + minutes;
                    }
                    
                    value["duration_days"] = days;
                    value["duration_hours"] = hours;
                    value["duration_minutes"] = minutes;
                });

                res.render('./admin/admin_dashboard', {title: 'Admin | Dashboard', schedules: schedules, layout: './layouts/admin_layout'});
            })
    res.render('./reg_user/user_dashboard', {title: 'user | Dashboard', layout: './layouts/user_layout'});
}

const edit_profile_get = (req, res) => {
    
    res.render('./reg_user/user_editprofile', {title: 'user | Edit Profile', layout: './layouts/user_layout'});
}

module.exports = {
    view_profile_get,
    view_dashboard_get,
    edit_profile_get

}
