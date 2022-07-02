CREATE VIEW `passenger_details` AS SELECT `fs`.`ID` AS `FlightScheduleID`,`FS`.`FlightNo`, `FS`.`StateID`, `DepartureDate`, `DepartureTime`, `ArrivalDate`, `ArrivalTime`, 
`B`.`ID` `BookingID`, `PD`.`TypeID`,
`SeatNo`, `Gender`, `FirstName`, `LastName`, `DateOfBirth` 
FROM `FlightSchedule` `FS` JOIN `Booking` `B` JOIN `PassengerDetails` `PD`
ON `FS`.`ID` = `B`.`FlightScheduleID` AND `B`.`ID` = `PD`.`BookingID` WHERE `StateID` = 1 
ORDER BY `DepartureDate`, `DepartureTime`;