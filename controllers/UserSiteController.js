const ProfileModel = require("../models/ProfileModel");
const UserDashboardModel = require("../models/UserDashboardModel");
const FlightSchedule = require("../models/FlightSchedule");
const FlightModel = require("../models/Flight");
const UserModel = require("../models/userModel");

const view_profile_get = (req, res) => {
    const con = req.dbCon;

    const TravellerID = req.user.id;
    ProfileModel.viewUserProfile(TravellerID,con,(err,result,fields)=>{
        if (err) throw err;
            
            const userDetail = {
                'fName': result[0]['FirstName'],
                'lName': result[0]['LastName'],
                'email': result[0]['Email'],
                'ContactNumber': result[0]['ContactNumber'],
            }
            res.render('./reg_user/user_profile', {title: 'user | Profile',userDetail:userDetail, layout: './layouts/user_layout'});
        })
    }  
    


const view_dashboard_get = (req, res) =>{ 
    const dbCon = req.dbCon;

    const RegisteredID = req.user.id;

    UserDashboardModel.view_dashboard_get(RegisteredID, dbCon, (err, schedules1, fields) => {
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

                schedules1.forEach((value, index, array) => {
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

                res.render('./reg_user/user_dashboard', {title: 'user | Dashboard',schedules1: schedules1, layout: './layouts/user_layout'});
            })
        })
   
    })
}

const view_edit_profile_get = (req,res) => {
    const con = req.dbCon;

    const TravellerID = req.user.id;
    ProfileModel.viewUserProfile(TravellerID,con,(err,result,fields)=>{
        if (err) throw err;
            
            const userDetail = {
                'fName': result[0]['FirstName'],
                'lName': result[0]['LastName'],
                'email': result[0]['Email'],
                'ContactNumber': result[0]['ContactNumber'],
            }
            res.render('./reg_user/user_editprofile', {title: 'user | Edit Profile',userDetail:userDetail, layout: './layouts/user_layout'});
        })
    }


const view_edit_profile_post = (req, res) => {
    const data= req.body;
    const dbCon = req.dbCon;

    FirstName = data.fName;
    LastName = data.lName;
    Email = data.email;

    


    res.render('./reg_user/user_editprofile', {title: 'user | Edit Profile', layout: './layouts/user_layout'});
}

module.exports = {
    view_profile_get,
    view_dashboard_get,
    view_edit_profile_post,
    view_edit_profile_get

}
