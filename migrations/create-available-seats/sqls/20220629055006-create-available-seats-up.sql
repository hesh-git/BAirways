CREATE TABLE `airlinedbms`.`availableseats` (
  `FlightScheduleID` INT NOT NULL,
  `TravelClassID` INT NOT NULL,
  `AvailableNoSeats` INT NULL,
  INDEX `availableSeats_ibfk_1_idx` (`FlightScheduleID` ASC) VISIBLE,
  INDEX `availableSeats_ibfk_2_idx` (`TravelClassID` ASC) VISIBLE,
  CONSTRAINT `availableSeats_ibfk_1`
    FOREIGN KEY (`FlightScheduleID`)
    REFERENCES `airlinedbms`.`flightschedule` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `availableSeats_ibfk_2`
    FOREIGN KEY (`TravelClassID`)
    REFERENCES `airlinedbms`.`travelclass` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);