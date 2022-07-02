CREATE VIEW `flight_statistics` AS SELECT `FS`.`ID` `FlightScheduleID`, `F`.`Origin`, `F`.`Destination`, `S`.`Name` `FlightState`, sum(`NumPassengers`) `TotalNumPassengers` 
FROM `FlightSchedule` `FS` JOIN `State` `S` JOIN `Flight` `F` JOIN
`Booking` `B` ON `FS`.`StateID` = `S`.`ID` AND `FS`.`FlightNo` = `F`.`FlightNo` AND `FS`.`ID` = `B`.`FlightScheduleID`
 GROUP BY `FS`.`ID`;