/* Replace with your SQL commands */
ALTER TABLE `airlinedbms`.`flightschedule` 
ADD COLUMN `ArrivalDate` DATE NOT NULL AFTER `DepartureTime`,
ADD COLUMN `ArrivalTime` TIME NOT NULL AFTER `ArrivalDate`,
CHANGE COLUMN `StartTime` `DepartureDate` DATE NOT NULL ,
CHANGE COLUMN `EndTime` `DepartureTime` TIME NOT NULL ;