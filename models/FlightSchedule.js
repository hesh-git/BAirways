const AircraftModel = require("./AircraftModel");

const update_flight_schedule = (schedule_id, DepartureDate, DepartureTime, ArrivalDate, ArrivalTime, dbCon, callback) => {


        const sql = "UPDATE `FlightSchedule` SET `DepartureDate` = ?, `DepartureTime` = ?, `ArrivalDate` = ?, `ArrivalTime` = ?, `StateID` = ? WHERE `ID` = ?";

        dbCon.query(sql, [DepartureDate, DepartureTime, ArrivalDate, ArrivalTime, 3, schedule_id], callback);
    
}

const get_schedules_for_day = (Date, dbCon, callback) => {
    const sql_change_to_ontime = "UPDATE `FlightSchedule` SET `StateID` = ? WHERE `DepartureDate` = ? AND `DepartureTime` <= ? AND `StateID` = ?";
    //const month = Date.getUTCMonth() + 1;
    const month = Date.month() + 1;
    //const dateformated = Date.getUTCFullYear() + "-" + month +"-" + Date.getUTCDate();
    const dateformated = Date.year() + "-" + month +"-" + Date.date();
    //const time = Date.getHours() + ":" + Date.getMinutes();
    const time = Date.hour() + ":" + Date.minutes();
    
    dbCon.query(sql_change_to_ontime, [2, dateformated, time, 1], (err, result, fields) => {
        if(err) throw err;

        // const sql = "SELECT * FROM `FlightSchedule` WHERE `DepartureDate` <= ? AND `ArrivalDate` >= ?";
        const sql = "SELECT * FROM `FlightSchedule` WHERE `DepartureDate` <= ? AND `ArrivalDate` >= ?";
        
        dbCon.query(sql, [dateformated, dateformated], callback);
    });
    
}

const get_all_states = (dbCon, callback) => {
    const sql = "SELECT * FROM `State`";

    dbCon.query(sql, callback);
}


const add_schedule = (FlightNo, AircraftID, StateID, DepartureDate, DepartureTime, ArrivalDate, ArrivalTime, dbCon, callback) => {
    dbCon.beginTransaction((err) => {
        if(err) {
            // throw err;
            return callback(err, null);
            // return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
        }
    
        // FlightSchedule.add_flight_schedule(FlightNo, AircraftID, StateID, DepartureDate, DepartureTime, ArrivalDate, ArrivalTime, dbCon, (err, result, fields) => {
            // if(err) throw err;
        const seat_cap_sql = "SELECT `SeatingCapacity` FROM `Aircraft` a join `AircraftModel` m on `a`.`ModelID` = `m`.`ID` where `a`.`ID` = ?";

        dbCon.query(seat_cap_sql, [AircraftID], (err, result, fields) => {
            if(err) {
                dbCon.rollback(() => {
                    // throw err;
                    return callback(err, null);
                    // return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                });
                
            }
            const seat_capacity = result[0]["SeatingCapacity"];
            
            const sql_add_schedule = "INSERT INTO `FlightSchedule`(`FlightNo`, `AircraftID`, `StateID`, `DepartureDate`, `DepartureTime`, `ArrivalDate`, `ArrivalTime`, `AvailableNoSeats`, `NoPassengers`) VALUES (?,?,?,?,?,?,?,?,?)";
    
            dbCon.query(sql_add_schedule, [FlightNo, AircraftID, StateID, DepartureDate, DepartureTime, ArrivalDate, ArrivalTime, seat_capacity, 0], (err, result, fields) => {
                if(err) {
                    dbCon.rollback(() => {
                        return callback(err, null);
                        // return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                    });
                }

                const flightScheduleID = result.insertId;

                AircraftModel.get_seat_cap_details(flightScheduleID, dbCon, (err, seat_cap_details, fields) => {
                    // if(err) throw err;
                    if(err) {
                        dbCon.rollback(() => {
                            return callback(err, null);
                            // return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                        });
                    }
    
                    seat_capacities = {};
                    seat_cap_details.forEach((value, index, array) => {
                        seat_capacities[value["TravelClassID"]] = {
                            "NumRows": value["NumRows"],
                            "NumCols": value["NumCols"]
                        }
                    });
    
                    AircraftModel.add_seats_to_seat(flightScheduleID, 1, 0, seat_capacities[1]["NumRows"], seat_capacities[1]["NumCols"], dbCon, (err, result, fields) => {
                        // if(err) throw err;
                        if(err) {
                            dbCon.rollback(() => {
                                return callback(err, null);
                                // return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                            });
                        }
                    });
    
                    AircraftModel.add_seats_to_seat(flightScheduleID, 2, seat_capacities[1]["NumRows"], seat_capacities[2]["NumRows"], seat_capacities[2]["NumCols"], dbCon, (err, result, fields) => {
                        // if(err) throw err;
                        if(err) {
                            dbCon.rollback(() => {
                                return callback(err, null);
                                // return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                            });
                        }
                    });
    
                    AircraftModel.add_seats_to_seat(flightScheduleID, 3, seat_capacities[1]["NumRows"] + seat_capacities[2]["NumRows"], seat_capacities[3]["NumRows"], seat_capacities[3]["NumCols"], dbCon, (err, result, fields) => {
                        // if(err) throw err;
                        if(err) {
                            dbCon.rollback(() => {
                                return callback(err, null);
                                // return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                            });
                        }
                    });
    
                    dbCon.commit((err) => {
                        if(err) {
                            dbCon.rollback(() => {
                                return callback(err, null);
                                // return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                            });
                        }
    
                        return callback(null, true);
    
                    });
                })
            });
        });

    })
}

module.exports = {
    get_schedules_for_day,
    get_all_states,
    update_flight_schedule,
    add_schedule
}