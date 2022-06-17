CREATE TABLE `airlinedbms`.`seatingcapacity` (
  `ModelID` INT NULL,
  `TravelClassID` INT NULL,
  `NumRows` INT NULL,
  `NumCols` INT NULL,
    FOREIGN KEY (`ModelID`)
    REFERENCES `airlinedbms`.`aircraftmodel` (`ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    FOREIGN KEY (`TravelClassID`)
    REFERENCES `airlinedbms`.`travelclass` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
