-- ALTER TABLE `airlinedbms`.`seat` 
-- DROP COLUMN `AircraftID`,
-- DROP PRIMARY KEY,
-- ADD PRIMARY KEY (`SeatNo`),
-- DROP INDEX `AircraftID` ;
-- ;

ALTER TABLE `airlinedbms`.`seat` 
DROP FOREIGN KEY `seat_ibfk_2`;
ALTER TABLE `airlinedbms`.`seat` 
DROP COLUMN `AircraftID`,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`SeatNo`),
DROP INDEX `AircraftID` ;
;
