delimiter //
CREATE TRIGGER categorize_traveller before update ON registeredTraveller
		FOR EACH ROW
        BEGIN 
            declare newcatid int;
			set newcatid = (select id 
							from category 
                            where new.NumBookings between minNoBooking and maxNoBooking);
                            
			IF new.CatagoryID != newcatid
            THEN
				SET new.catagoryid = newcatid;
			END IF;
		END; //
delimiter ;