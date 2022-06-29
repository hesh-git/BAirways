ALTER TABLE `airlinedbms`.`passengerdetails` 
DROP FOREIGN KEY `passengerdetails_ibfk_3`;
ALTER TABLE `airlinedbms`.`passengerdetails` 
CHANGE COLUMN `SeatNo` `SeatNo` VARCHAR(10) NULL ;
ALTER TABLE `airlinedbms`.`passengerdetails` 
ADD CONSTRAINT `passengerdetails_ibfk_3`
  FOREIGN KEY (`SeatNo`)
  REFERENCES `airlinedbms`.`seat` (`SeatNo`);