delimiter //
CREATE TRIGGER revenue_update after update ON booking
       FOR EACH ROW
       BEGIN
		   declare reve decimal(20,2);
           declare aircraftid varchar(10);
           select a.revenue, a.id
				into reve, aircraftid
				from booking b
				join flightschedule fs
				on fs.id = b.flightscheduleid
				join aircraft a
				on a.id =fs.aircraftid
				where b.id = new.id;
		   
           update aircraft 
		   set revenue = reve+new.TotalTicketPrice -new.discountAmount
				where id = aircraftid;
       END;//
delimiter ;