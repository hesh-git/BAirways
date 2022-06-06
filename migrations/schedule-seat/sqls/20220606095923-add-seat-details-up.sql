ALTER TABLE `airlinedbms`.`flightschedule` 
ADD COLUMN `AvailableNoSeats` INT NOT NULL AFTER `ArrivalTime`,
ADD COLUMN `NoPassengers` INT NOT NULL AFTER `AvailableNoSeats`;