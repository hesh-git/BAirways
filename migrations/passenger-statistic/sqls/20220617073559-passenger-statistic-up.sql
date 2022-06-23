CREATE VIEW `passenger_statistics` AS SELECT `F`.`Destination` `Destination`, `FS`.`ArrivalDate` `ArrivalDate`, sum(`B`.`NumPassengers`) `NumPassengers` FROM `FlightSchedule` `FS` JOIN `Flight` `F` JOIN `Booking` `B`
ON `FS`.`FlightNo` = `F`.`FlightNo` AND `FS`.`ID` = `B`.`FlightScheduleID` GROUP BY `F`.`Destination`, `FS`.`ArrivalDate`;