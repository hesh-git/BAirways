ALTER TABLE `airlinedbms`.`seat` 
DROP PRIMARY KEY,
ADD PRIMARY KEY (`SeatNo`, `AircraftID`);