-- ALTER TABLE `airlinedbms`.`seat` 
-- ADD COLUMN `FlightScheduleID` INT NOT NULL AFTER `SeatNo`,
-- DROP PRIMARY KEY,
-- ADD PRIMARY KEY (`SeatNo`, `FlightScheduleID`),
-- ADD INDEX `seat_ibfk_4_idx` (`FlightScheduleID` ASC) VISIBLE;
-- ;
-- ALTER TABLE `airlinedbms`.`seat` 
-- ADD CONSTRAINT `seat_ibfk_4`
--   FOREIGN KEY (`FlightScheduleID`)
--   REFERENCES `airlinedbms`.`flightschedule` (`ID`)
--   ON DELETE NO ACTION
--   ON UPDATE NO ACTION;

ALTER TABLE `airlinedbms`.`seat` 
ADD CONSTRAINT `seat_ibfk_5`
  FOREIGN KEY (`FlightScheduleID`)
  REFERENCES `airlinedbms`.`flightschedule` (`ID`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;