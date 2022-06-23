ALTER TABLE `airlinedbms`.`seat` 
DROP COLUMN `AircraftID`,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`SeatNo`),
DROP INDEX `AircraftID` ;
;