/* Replace with your SQL commands */
ALTER TABLE `airlinedbms`.`booking` 
ADD COLUMN `BookingTime` TIME NOT NULL AFTER `BookingDate`,
CHANGE COLUMN `DateTime` `BookingDate` DATE NOT NULL ;

