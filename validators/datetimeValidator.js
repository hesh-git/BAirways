const create_date_object = (Date) => {
    const month = Date.getUTCMonth + 1;
    const year = Date.getUTCFullYear();
    const date = Date.getUTCDate();

    return {
        month,
        year,
        date,
        islower: function(secondDate) {
            if(secondDate.year < year) {
                return false;
            } else if(secondDate.year > year) {
                return true;
            } else if(secondDate.month < month) {
                return false;
            } else if(secondDate.month > month) {
                return true;
            } else if(secondDate.date < date) {
                return false;
            } else if(secondDate.date > date) {
                return true;
            } else {
                return false;
            }
        },
        isequal: function(secondDate) {
            if(secondDate.year == year && secondDate.month == month && secondDate.date == date){
                return true;
            } 
            return false;
        }
    }
}

const create_time_object = (Time) => {
    const time_data = Time.split(":");
    const hours = parseInt(time_data[0]);
    const minutes = parseInt(time_data[1]);

    return {
        hours,
        minutes,
        islower: function(secondTime) {
            if(secondTime.hours > hours) {
                return true;
            } else if(secondTime.hours < hours) {
                return false;
            } else if(secondTime.minutes > minutes) {
                return true;
            } 
            return false;
        },
        isequal: function(secondTime) {
            if(secondTime.hours == hours && secondTime.minutes == minutes) {
                return true;
            }
            return false;
        }
    }
}

const create_date_time_obj = (Date, Time) => {
    const date_data = Date.split("-");
    const month = parseInt(date_data[1]);
    const year = parseInt(date_data[0]);
    const date = parseInt(date_data[2]);
    const time_data = Time.split(":");
    const hours = parseInt(time_data[0]);
    const minutes = parseInt(time_data[1]);

    return {
        month,
        year,
        date,
        hours,
        minutes,
        islower: function(secondDateTime) {
            if(secondDateTime.year < year) {
                return false;
            } else if(secondDateTime.year > year) {
                return true;
            } else if(secondDateTime.month < month) {
                return false;
            } else if(secondDateTime.month > month) {
                return true;
            } else if(secondDateTime.date < date) {
                return false;
            } else if(secondDateTime.date > date) {
                return true;
            } if(secondDateTime.hours > hours) {
                return true;
            } else if(secondDateTime.hours < hours) {
                return false;
            } else if(secondDateTime.minutes > minutes) {
                return true;
            } 
            return false;
        },
        isequal: function(secondDateTime) {
            if(secondDateTime.year == year && secondDateTime.month == month && secondDateTime.date == date 
                && secondDateTime.hours == hours && secondDateTime.minutes == minutes){
                return true;
            } 
            return false;
        }
    }
}

const validate_date_time = (DepartureDate, DepartureTime, ArrivalDate, ArrivalTime) => {
    const today = new Date();
    const month = today.getUTCMonth() + 1;
    const today_str = today.getUTCFullYear() + "-" + month +"-" + today.getUTCDate();
    const today_time = today.getHours() + ":" + today.getMinutes();

    const DepartureDateTime = create_date_time_obj(DepartureDate, DepartureTime);
    const ArrivalDateTime = create_date_time_obj(ArrivalDate, ArrivalTime);
    const TodayDateTime = create_date_time_obj(today_str, today_time);

    if(TodayDateTime.islower(DepartureDateTime) && TodayDateTime.islower(ArrivalDateTime) && DepartureDateTime.islower(ArrivalDateTime)) {
        return true;
    }
    return false;
}

const compare_date_range = (FromDate, ToDate) => {
    
}

module.exports = {
    validate_date_time
}