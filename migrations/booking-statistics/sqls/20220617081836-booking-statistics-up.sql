CREATE VIEW `booking_statistics` AS SELECT `PD`.`TypeID`, `B`.`BookingDate`, count(`B`.`ID`) `numBookings` FROM `FlightSchedule` `FS` JOIN `Booking` `B` JOIN `PassengerDetails` `PD` ON 
`FS`.`ID` = `B`.`FlightScheduleID` AND `B`.`ID` = `PD`.`BookingID` GROUP BY `PD`.`TypeID`, `B`.`BookingDate`;