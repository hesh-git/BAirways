// save location name to location table
const save_to_location = (name, dbCon, callback) => {
    let sql = 'INSERT INTO `Location` (`Name`) VALUES (?)';
    dbCon.query(sql, [name], callback);
}

// create location pairs
const save_location_pair = (parentLevelID, childLevelID, dbCon, callback) => {
    let sql = 'INSERT INTO `LocationPair` (`ParentLevelID`, `ChildLevelID`) VALUES (?, ?)';
    dbCon.query(sql, [parentLevelID, childLevelID], callback);
}

// save airport code to Airport table
const save_airport_code = (airportCode, locationID, dbCon, callback) => {
    let sql = 'INSERT INTO `Airport` (`AirportCode`, `LocationID`) VALUES (?,?)';
    dbCon.query(sql, [airportCode, locationID], callback);
}

const get_all_airports = (dbCon, callback) => {
    let sql = 'SELECT `AirportCode` FROM `airport`';
    dbCon.query(sql, callback);
}

const check_airport_code = (AirportCode, dbCon, callback) => {
    const sql = "SELECT * FROM `airport` WHERE `AirportCode` = ?";
    dbCon.query(sql, [AirportCode], callback);
}


const save_airport = (AirportCode, City, State, Country, dbCon, callback) => {
    dbCon.beginTransaction((err) => {
        if(err) {
            return callback(err, null);
            // return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
        }

        // save the airport code to database
        save_to_location(AirportCode, dbCon, (err, result, fields) => {
            // if(err) throw err;
            if(err) {
                dbCon.rollback(() => {
                    return callback(err, null);
                    // return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                });
            }

            const airport_location_id = result.insertId; // location id of airport
            // save airport code to airport
            save_airport_code(AirportCode, airport_location_id, dbCon, (err, result, fields) => {
                // if(err) throw err;
                if(err) {
                    dbCon.rollback(() => {
                        return callback(err, null);
                        // return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                    });
                }

                // save city to database
                save_to_location(City, dbCon, (err, result, fields) => {
                    // if(err) throw err;
                    if(err) {
                        dbCon.rollback(() => {
                            return callback(err, null);
                            // return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                        });
                    }

                    const city_id = result.insertId; // location id of city

                    // add airport code and city as pair to database
                    save_location_pair(city_id,airport_location_id, dbCon, (err, result, fields) => {
                        // if(err) throw err;
                        if(err) {
                            dbCon.rollback(() => {
                                return callback(err, null);
                                // return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                            });
                        }

                        // if state exists in location levels
                        if(State) {
                            save_to_location(State, dbCon, (err, result, fields) => {
                                // if(err) throw err;
                                if(err) {
                                    dbCon.rollback(() => {
                                        return callback(err, null);
                                        // return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                                    });
                                }

                                const state_id = result.insertId; // location id of State

                                // add city and state as a location pair to database
                                save_location_pair(state_id, city_id, dbCon, (err, result, fields) => {
                                    // if(err) throw err;
                                    if(err) {
                                        dbCon.rollback(() => {
                                            return callback(err, null);
                                            // return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                                        });
                                    }

                                    // save Country
                                    save_to_location(Country, dbCon, (err, result, fields) => {
                                        // if(err) throw err;
                                        if(err) {
                                            dbCon.rollback(() => {
                                                return callback(err, null);
                                                // return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                                            });
                                        }

                                        const country_id = result.insertId; // location id of country

                                        // add country and state as a location pair to database
                                        save_location_pair(country_id, state_id, dbCon, (err, result, fields) => {
                                            if(err) {
                                                dbCon.rollback(() => {
                                                    return callback(err, null);
                                                    // return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                                                });
                                            }


                                        });
                                    });
                                });

                            });
                        }
                        // when there is no state exists in location levels
                        else {
                            // save country
                            save_to_location(Country, dbCon, (err, result, fields) => {
                                if(err) {
                                    dbCon.rollback(() => {
                                        return callback(err, null);
                                        // return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                                    });
                                }

                                const country_id = result.insertId; // location id of country

                                // add country and city as a location pair to database
                                save_location_pair(country_id, city_id, dbCon, (err, result, fields) => {
                                    if(err) {
                                        dbCon.rollback(() => {
                                            return callback(err, null);
                                            // return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                                        });
                                    }
                                });
                            });
                        }
                    });
                });
            });

            dbCon.commit((err) => {
                if(err) {
                    dbCon.rollback(() => {
                        return callback(err, null);
                        // return res.status(500).render('error', { title : '500', layout: "./layouts/payment_layout", error: {"msg": "Internal Server Error", "status": 500}});
                    });
                }

                return callback(null, true);
            })
            
        })
    })
}

module.exports = {
    save_to_location,
    save_location_pair,
    save_airport_code,
    get_all_airports,
    check_airport_code,
    save_airport
}